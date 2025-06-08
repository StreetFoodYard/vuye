import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

import { useThemeColor, View } from 'components/Themed';

import { SafeAreaView } from 'react-native-safe-area-context';
import TopNav from 'components/molecules/TopNav';
import { Text } from 'components/Themed';

import CategoriesGrid from './CategoriesGrid';
import { TransparentView } from 'components/molecules/ViewComponents';
import ProfessionalCategoriesList from './ProfessionalCategoriesList';
import SegmentedControl from 'components/molecules/SegmentedControl';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white'
  },
  toggleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
    paddingHorizontal: 20
  }
});

export default function CategoriesPage() {
  const [professionalMode, setProfessionalMode] = useState(false);
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <TopNav />
      <TransparentView style={styles.toggleContainer}>
        <SegmentedControl
          values={[t('common.personal'), t('common.professional')]}
          selectedIndex={professionalMode ? 1 : 0}
          onChange={(index) => setProfessionalMode(index === 1)}
          containerStyle={{ width: '100%' }}
        />
      </TransparentView>
      <View style={styles.container}>
        {professionalMode ? <ProfessionalCategoriesList /> : <CategoriesGrid />}
      </View>
    </SafeAreaView>
  );
}
