import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useParams } from 'react-router';
import './Plugin.css';
import { App } from '@capacitor/app';
import { AppLauncher } from '@capacitor/app-launcher';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { Browser } from '@capacitor/browser';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Clipboard } from '@capacitor/clipboard';
import { Device } from '@capacitor/device';
import { Dialog } from '@capacitor/dialog';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Network } from '@capacitor/network';
import { ScreenReader } from '@capacitor/screen-reader';
import { Share } from '@capacitor/share';
import { Storage } from '@capacitor/storage';
import { TextZoom } from '@capacitor/text-zoom';
import { Toast } from '@capacitor/toast';

import { useCallback } from 'react';

interface PluginEntry {
  name: string;
  package: string;
  description: string;
  methods: { [key: string]: any };
}

const pluginData = {
  'action-sheet': {
    name: 'Action Sheet',
    package: '@capacitor/action-sheet',
    description:
      'La API de hoja de acción proporciona acceso a hojas de acción nativas, que aparecen desde la parte inferior de la pantalla y muestran las acciones que puede realizar un usuario.',
    methods: {
      showActions: async () => {
        return ActionSheet.showActions({
          title: 'Photo Options',
          message: 'Selecciona una opción',
          options: [
            {
              title: 'Actualizar',
            },
            {
              title: 'Compartir',
            },
            {
              title: 'Remover',
              style: ActionSheetButtonStyle.Destructive,
            },
          ],
        });
      },
    },
  },
  'app': {
    name: 'App',
    description:
      'La API de la aplicación maneja el estado y los eventos de la aplicación de alto nivel. Por ejemplo, esta API emite eventos cuando la aplicación entra y sale del primer plano, maneja los enlaces profundos, abre otras aplicaciones y administra el estado persistente del complemento. '
      ,
    package: '@capacitor/app',
    methods: {
      exitApp: () => App.exitApp(),
      getInfo: () => App.getInfo(),
      getState: () => App.getState(),
      getLaunchUrl: () => App.getLaunchUrl(),
    },
  },
  'app-launcher': {
    name: 'App Launcher',
    description: 'La API AppLauncher permite que su aplicación abra otras aplicaciones. (canopenurl) Devuelve un valor booleano que indica si una aplicación está disponible para manejar un esquema de URL. (openurl) Intenta abrir de forma asíncrona el recurso en la URL especificada.'
   ,
    package: '@capacitor/app-launcher',
    methods: {
      canOpenUrl: () => {
        return AppLauncher.openUrl({ url: 'https://developer.apple.com/documentation/uikit/uiapplication/1622952-canopenurl' });
      },
      openUrl: () => {
        return AppLauncher.openUrl({
          url: 'https://developer.apple.com/documentation/uikit/uiapplication/1648685-open',
        });
      },
    },
  },
  'browser': {
    name: 'Browser',
    description: `La API del navegador brinda la capacidad de abrir un navegador en la aplicación y suscribirse a los eventos del navegador.`,
    package: '@capacitor/browser',
    methods: {
      open: () => {
        Browser.open({ url: 'http://capacitorjs.com/' });
      },
      close: () => Browser.close(),
    },
  },
  'camera': {
    name: 'Camera',
    package: '@capacitor/camera',
    description:
      'La API de la cámara brinda la posibilidad de tomar una foto con la cámara o elegir una existente del álbum de fotos.'
      ,
    methods: {
      getPhoto: async () => {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: true,
          resultType: CameraResultType.Uri,
        });

        // image.webPath will contain a path that can be set as an image src.
        // You can access the original file using image.path, which can be
        // passed to the Filesystem API to read the raw data of the image,
        // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
        var imageUrl = image.webPath;

        // Can be set to the src of an image now
        // imageElement.src = imageUrl;
      },
    },
  },
  'clipboard': {
    name: 'Clipboard',
    description:
      'La API del portapapeles permite copiar y pegar en/desde el portapapeles del sistema.',
    package: '@capacitor/clipboard',
    methods: {
      
      write: () =>
        Clipboard.write({
          string: 'este texto fue copiado!',
        }),
      read: () => Clipboard.read(),
    },
  },
  'dialog': {
    name: 'Dialog',
    description:
      'La API de diálogo proporciona métodos para activar ventanas de diálogo nativas para alertas, confirmaciones y solicitudes de entrada.',
    package: '@capacitor/dialog',
    methods: {
      alert: () =>
        Dialog.alert({
          title: 'Stop',
          message: 'esto es una alerta, algo anda mal crack',
        }),
      confirm: () =>
        Dialog.confirm({
          title: 'Confirm',
          message: `estas seguro de que quieres hacer eso :O?`,
        }),
      prompt: () =>
        Dialog.prompt({
          title: 'Hello',
          message: `cual es tu nombre?`,
        }),
    },
  },
  'screen-reader': {
    name: 'Screen Reader',
    description:
      'La API del lector de pantalla proporciona acceso a TalkBack/VoiceOver/etc. y proporciona capacidades simples de conversión de texto a voz para la accesibilidad visual.',
    package: '@capacitor/screen-reader',
    methods: {
      isEnabled: () => ScreenReader.isEnabled(),
      speak: () =>
        ScreenReader.speak({
          value: 'Hello, Capacitor, how are you?!',
        }),
    },
  },
  'share': {
    name: 'Share',
    description:
      'Share API proporciona métodos para compartir contenido en cualquier aplicación habilitada para compartir que el usuario haya instalado.',
    package: '@capacitor/share',
    methods: {
      share: () =>
        Share.share({
          title: 'See cool stuff',
          text: 'Really awesome thing you need to see right now',
          url: 'http://ionicframework.com/',
          dialogTitle: 'Share with buddies',
        }),
    },
  },
  'splash-screen': {
    name: 'Splash Screen',
    description:
      'The Splash Screen API provides methods for showing or hiding a Splash image.',
    package: '@capacitor/splash-screen',
    methods: {},
  },
  'toast': {
    name: 'Toast',
    description:
      'La API de Toast proporciona una notificación emergente para mostrar información importante a un usuario.',
    package: '@capacitor/toast',
    methods: {
      show: () =>
        Toast.show({
          text: 'hello my friend, good day!',
        }),
    },
  },
} as { [key: string]: PluginEntry };

const PluginDemo = ({ plugin }: { plugin: PluginEntry }) => {
  const runMethod = useCallback(
    async method => {
      const methodDemo = plugin.methods[method];
      try {
        const ret = await methodDemo?.();
        console.log(`[${plugin.name}] ${method}() - `, ret);
      } catch (e) {
        console.error(e);
      }
    },
    [plugin],
  );

  return (
    <div className="plugin">
      <h2>{plugin.name}</h2>
      <p>{plugin.description}</p>
      <h4>Methods</h4>
      <IonList>
        {Object.keys(plugin.methods).map(method => (
          <IonItem key={method}>
            <IonLabel slot="start">{method}</IonLabel>
            <IonButton slot="end" onClick={() => runMethod(method)}>
              Run
            </IonButton>
          </IonItem>
        ))}
      </IonList>
    </div>
  );
};

const Page: React.FC = () => {
  const { name } = useParams<{ name: string }>();

  const plugin = pluginData[name];

  if (!plugin) {
    return null;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{plugin.name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <PluginDemo plugin={plugin} />
      </IonContent>
    </IonPage>
  );
};

export default Page;
