import React from 'react';

import { StyleSheet, Platform } from 'react-native';

import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  setAccessToken,
  setRefreshToken
} from 'reduxStore/slices/auth/actions';

import { Text, PasswordInput } from 'components/Themed';
import { Button } from 'components/molecules/ButtonComponents';

import { getTokenAsync } from 'utils/authRequests';
import { getReCaptchaSiteKey, shouldUseReCaptcha } from 'utils/recaptchaUtils';
import ReCaptcha from 'components/molecules/ReCaptcha';

import { UnauthorisedTabParamList } from 'types/base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  PageTitle,
  PageSubtitle,
  PrimaryText,
  AlmostBlackText
} from 'components/molecules/TextComponents';
import {
  AlmostWhiteContainerView,
  TransparentView
} from 'components/molecules/ViewComponents';
import { PaddedSpinner } from 'components/molecules/Spinners';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import SafePressable from 'components/molecules/SafePressable';
import PhoneOrEmailInput from 'components/molecules/PhoneOrEmailInput';

const styles = StyleSheet.create({
  inputLabelWrapper: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%'
  },
  inputLabel: {
    fontSize: 12,
    textAlign: 'left'
  },
  confirmButton: {
    marginTop: 30,
    marginBottom: 15
  },
  demoButton: {
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: '#4CAF50', // Green color
  },
  otherOptsWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%'
  },
  usernameInput: { marginBottom: 10, width: '100%' },
  passwordInput: { width: '100%' },
  recaptchaContainer: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
    width: '100%'
  },
  demoText: {
    marginTop: 20,
    marginBottom: 5,
    fontSize: 16,
    textAlign: 'center',
    color: '#333'
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    width: '100%',
    marginVertical: 20
  }
});

const LoginScreen = ({
  navigation
}: NativeStackScreenProps<UnauthorisedTabParamList, 'Login'>) => {
  const [username, setUsername] = React.useState<string>('');
  const [password, onChangePassword] = React.useState<string>('');
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [usingEmail, setUsingEmail] = React.useState<boolean>(false);
  const [recaptchaToken, setRecaptchaToken] = React.useState<string>('');

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const handleRecaptchaVerify = (token: string) => {
    setRecaptchaToken(token);
  };

  const setTokenAsync = async (
    usernameToUse: string,
    passwordToUse: string,
    isEmail: boolean
  ) => {
    try {
      // For web, verify recaptcha token is present
      if (shouldUseReCaptcha() && !recaptchaToken) {
        Toast.show({
          type: 'error',
          text1: t('common.errors.recaptchaRequired')
        });
        setSubmitting(false);
        return;
      }

      const res = await getTokenAsync(usernameToUse, passwordToUse, isEmail);
      const { access, refresh } = res;
      if (access) {
        dispatch(setAccessToken(access));
        dispatch(setRefreshToken(refresh));
      } else {
        Toast.show({
          type: 'error',
          text1: t('screens.logIn.failedLogin')
        });
        setSubmitting(false);
      }
    } catch (err) {
      console.log(err);
      Toast.show({
        type: 'error',
        text1: t('screens.logIn.failedLogin')
      });
      setSubmitting(false);
    }
  };

  return (
    <AlmostWhiteContainerView>
      <PageTitle text={t('screens.logIn.welcomeBack')} />
      <PageSubtitle
        text={
          usingEmail
            ? t('screens.logIn.enterEmail')
            : t('screens.logIn.enterNumber')
        }
      />
      <TransparentView style={styles.usernameInput}>
        <PhoneOrEmailInput
          usingEmail={usingEmail}
          value={username}
          changeUsingEmail={setUsingEmail}
          onValueChange={setUsername}
        />
      </TransparentView>
      <TransparentView style={styles.inputLabelWrapper}>
        <AlmostBlackText
          style={styles.inputLabel}
          text={t('screens.logIn.password')}
        />
      </TransparentView>
      <PasswordInput
        value={password}
        onChangeText={(text) => onChangePassword(text)}
        style={styles.passwordInput}
      />
      <TransparentView style={styles.otherOptsWrapper}>
        <SafePressable
          onPress={() => {
            navigation.navigate('ForgotPassword', { useEmail: usingEmail });
          }}
        >
          <PrimaryText text={t('screens.logIn.forgotPassword')} bold={true} />
        </SafePressable>
      </TransparentView>

      {/* Show reCAPTCHA only for web platform */}
      {shouldUseReCaptcha() && (
        <TransparentView style={styles.recaptchaContainer}>
          <ReCaptcha
            siteKey={getReCaptchaSiteKey()}
            onVerify={handleRecaptchaVerify}
          />
        </TransparentView>
      )}

      {submitting ? (
        <PaddedSpinner spinnerColor="buttonDefault" />
      ) : (
        <Button
          title={t('common.confirm')}
          onPress={() => {
            setSubmitting(true);
            setTokenAsync(username, password, usingEmail);
          }}
          style={styles.confirmButton}
        />
      )}
      <Text>{t('screens.logIn.dontHaveAccount')}</Text>
      <SafePressable
        onPress={() => {
          navigation.navigate('Signup');
        }}
      >
        <PrimaryText text={t('screens.logIn.signUp')} bold={true} />
      </SafePressable>

      {/* Demo section */}
      <View style={styles.separator} />
      <Text style={styles.demoText}>Try our Firebase Storage Demo</Text>
      <Button
        title="Firebase Storage Demo"
        onPress={() => {
          navigation.navigate('FileUploadDemo');
        }}
        style={styles.demoButton}
      />
    </AlmostWhiteContainerView>
  );
};

export default LoginScreen;
