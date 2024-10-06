import Card from 'components/Card';
import Modules from 'components/Modules';
import { SafeAreaView, StyleSheet } from 'react-native';

export default function TabOneScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Card />
      <Modules />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modulesContainer: {
    flex: 1,
  },
});
