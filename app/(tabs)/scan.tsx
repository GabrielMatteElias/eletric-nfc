import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  AppState,
  AppStateStatus,
  Dimensions,
  Image,
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Camera,
  type CameraRef,
  useCameraDevice,
  useCameraPermission,
  usePhotoOutput,
} from 'react-native-vision-camera';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CUTOUT_WIDTH = SCREEN_WIDTH * 0.78;
const CUTOUT_HEIGHT = SCREEN_HEIGHT * 0.18;
const CUTOUT_TOP = (SCREEN_HEIGHT - CUTOUT_HEIGHT) / 2 - 40;

const DEBOUNCE_COUNT = 3;
const SCAN_INTERVAL_MS = 600;
const DIGIT_REGEX = /\D/g;

function getImageSize(uri: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    Image.getSize(uri, (width, height) => resolve({ width, height }), reject);
  });
}

export default function ScanScreen() {
  const router = useRouter();
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const cameraRef = useRef<CameraRef>(null);
  const photoOutput = usePhotoOutput();

  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied'>(
    hasPermission ? 'granted' : 'unknown'
  );
  const [isScanning, setIsScanning] = useState(true);
  const [hasFinished, setHasFinished] = useState(false);
  const [statusText, setStatusText] = useState('Aponte para o visor do medidor');

  const scannerAnim = useRef(new Animated.Value(0)).current;
  const consecutiveRef = useRef<{ value: string; count: number }>({ value: '', count: 0 });
  const finishedRef = useRef(false);
  const processingRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateRef = useRef(AppState.currentState);

  async function cropToScanRegion(uri: string): Promise<string> {
    try {
      const { width: imgW, height: imgH } = await getImageSize(uri);

      const scaleX = imgW / SCREEN_WIDTH;
      const scaleY = imgH / SCREEN_HEIGHT;

      const cropX = Math.round(((SCREEN_WIDTH - CUTOUT_WIDTH) / 2) * scaleX);
      const cropY = Math.round(CUTOUT_TOP * scaleY);
      const cropW = Math.round(CUTOUT_WIDTH * scaleX);
      const cropH = Math.round(CUTOUT_HEIGHT * scaleY);

      // O método correto é ImageManipulator.manipulate()
      const context = ImageManipulator.manipulate(uri);

      context.crop({
        originX: cropX,
        originY: cropY,
        width: cropW,
        height: cropH,
      });

      const result = await context.renderAsync();
      const saved = await result.saveAsync({
        compress: 0.9,
        format: SaveFormat.JPEG,
      });

      return saved.uri;
    } catch (error) {
      console.error('[Crop Error]', error);
      return uri;
    }
  }

  useEffect(() => {
    if (hasPermission) setPermissionStatus('granted');
  }, [hasPermission]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', async (nextState: AppStateStatus) => {
      const wasBackground =
        appStateRef.current === 'background' || appStateRef.current === 'inactive';
      appStateRef.current = nextState;
      if (wasBackground && nextState === 'active') {
        const granted = await requestPermission();
        setPermissionStatus(granted ? 'granted' : 'denied');
      }
    });
    return () => sub.remove();
  }, [requestPermission]);

  const handleRequestPermission = useCallback(async () => {
    const granted = await requestPermission();
    setPermissionStatus(granted ? 'granted' : 'denied');
  }, [requestPermission]);

  const handleOpenSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scannerAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(scannerAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [scannerAnim]);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const onValidRead = useCallback(
    (reading: string) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      stopInterval();
      setIsScanning(false);
      setHasFinished(true);
      setStatusText(`Leitura: ${reading}`);
      setTimeout(() => {
        router.push({ pathname: '/resultScreen', params: { watts: reading } });
      }, 600);
    },
    [router, stopInterval]
  );

  const processSnapshot = useCallback(async () => {
    if (finishedRef.current || processingRef.current || !cameraRef.current) return;
    processingRef.current = true;

    try {
      const photoFile = await photoOutput.capturePhotoToFile(
        { flashMode: 'off', enableShutterSound: false },
        {}
      );

      const rawUri = photoFile.filePath.startsWith('file://')
        ? photoFile.filePath
        : `file://${photoFile.filePath}`;

      const croppedUri = await cropToScanRegion(rawUri);

      const result = await TextRecognition.recognize(croppedUri);
      const blocks = result?.blocks ?? [];

      for (const block of blocks) {
        const raw = (block.text ?? '').replace(DIGIT_REGEX, '');

        if (raw.length >= 1 && raw.length <= 9) {
          if (consecutiveRef.current.value === raw) {
            consecutiveRef.current.count += 1;
          } else {
            consecutiveRef.current = { value: raw, count: 1 };
          }
          if (consecutiveRef.current.count >= DEBOUNCE_COUNT) {
            onValidRead(raw);
          }
          break;
        }
      }
    } catch {
    } finally {
      processingRef.current = false;
    }
  }, [onValidRead, photoOutput]);

  useEffect(() => {
    if (permissionStatus !== 'granted' || !device) return;
    const delay = setTimeout(() => {
      intervalRef.current = setInterval(processSnapshot, SCAN_INTERVAL_MS);
    }, 1200);
    return () => {
      clearTimeout(delay);
      stopInterval();
    };
  }, [permissionStatus, device, processSnapshot, stopInterval]);

  const scannerTranslateY = scannerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, CUTOUT_HEIGHT - 2],
  });

  if (permissionStatus !== 'granted') {
    const isDenied = permissionStatus === 'denied';
    return (
      <View style={styles.centered}>
        <View style={styles.permIcon}>
          <Text style={styles.permIconText}>📷</Text>
        </View>
        <Text style={styles.permissionTitle}>
          {isDenied ? 'Permissão Negada' : 'Câmera Necessária'}
        </Text>
        <Text style={styles.permissionText}>
          {isDenied
            ? 'Acesse as configurações do sistema para liberar o acesso à câmera.'
            : 'Este app precisa da câmera para ler o medidor de energia.'}
        </Text>
        <TouchableOpacity
          style={styles.permBtn}
          onPress={isDenied ? handleOpenSettings : handleRequestPermission}
          activeOpacity={0.8}
        >
          <Text style={styles.permBtnText}>
            {isDenied ? 'Abrir Configurações' : 'Conceder Permissão'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionTitle}>Câmera não encontrada</Text>
        <Text style={styles.permissionText}>
          Não foi possível acessar a câmera traseira do dispositivo.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isScanning}
        outputs={[photoOutput]}
        resizeMode="cover"
      />

      <View style={styles.overlayTop} />
      <View style={styles.overlayBottom} />
      <View style={styles.overlaySideLeft} />
      <View style={styles.overlaySideRight} />

      <View style={[styles.cutout, { top: CUTOUT_TOP }]}>
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />

        {isScanning && (
          <Animated.View
            style={[
              styles.scanLine,
              { transform: [{ translateY: scannerTranslateY }] },
            ]}
          />
        )}

        {hasFinished && <View style={styles.successFlash} />}
      </View>

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leitura inteligente</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.footer}>
        <View style={styles.statusPill}>
          <View style={[styles.statusDot, isScanning && styles.statusDotActive]} />
          <Text style={styles.statusLabel}>{statusText}</Text>
        </View>
        <Text style={styles.hint}>Mantenha o medidor centralizado no quadro</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    backgroundColor: '#0a0a0f',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    gap: 16,
  },
  permIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(0,229,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  permIconText: {
    fontSize: 32,
  },
  permissionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  permissionText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  permBtn: {
    backgroundColor: '#00e5ff',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 8,
  },
  permBtnText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.3,
  },
  overlayTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: CUTOUT_TOP,
    backgroundColor: 'rgba(0,0,0,0.68)',
  },
  overlayBottom: {
    position: 'absolute',
    top: CUTOUT_TOP + CUTOUT_HEIGHT,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.68)',
  },
  overlaySideLeft: {
    position: 'absolute',
    top: CUTOUT_TOP,
    left: 0,
    width: (SCREEN_WIDTH - CUTOUT_WIDTH) / 2,
    height: CUTOUT_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.68)',
  },
  overlaySideRight: {
    position: 'absolute',
    top: CUTOUT_TOP,
    right: 0,
    width: (SCREEN_WIDTH - CUTOUT_WIDTH) / 2,
    height: CUTOUT_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.68)',
  },
  cutout: {
    position: 'absolute',
    left: (SCREEN_WIDTH - CUTOUT_WIDTH) / 2,
    width: CUTOUT_WIDTH,
    height: CUTOUT_HEIGHT,
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderColor: '#00e5ff',
    borderWidth: 3,
  },
  cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#00e5ff',
    shadowColor: '#00e5ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    opacity: 0.92,
  },
  successFlash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,229,255,0.18)',
    borderRadius: 2,
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 42 : 54,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: '#fff',
    fontSize: 26,
    lineHeight: 30,
    marginTop: -2,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 12,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.3)',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  statusDotActive: {
    backgroundColor: '#00e5ff',
    shadowColor: '#00e5ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  statusLabel: {
    color: '#e0f7ff',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  hint: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    letterSpacing: 0.2,
  },
});
