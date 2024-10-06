import 'react-native-gesture-handler';

import { UserProvider } from 'utils/useContext';

import RootStack from './navigation';

export default function App() {
  return (
    <UserProvider>
      <RootStack />
    </UserProvider>
  );
}
