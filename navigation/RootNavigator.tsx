import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';

import NotFoundScreen from '../screens/NotFoundScreen';
import CalendarScreen from '../screens/CalendarMain/CalendarScreen';
import AddTaskScreen from 'screens/Forms/TaskForms/AddTaskScreen';
import { RootTabParamList } from '../types/base';

import { useTranslation } from 'react-i18next';

import EditTaskScreen from 'screens/Forms/TaskForms/EditTaskScreen';
import {
  useGetCategorySetupCompletionsQuery,
  useGetUserDetailsQuery,
  useGetUserInvitesQuery
} from 'reduxStore/services/api/user';
import {
  AlmostBlackText,
  PrimaryText
} from 'components/molecules/TextComponents';
import useSetupPushNotifications from 'hooks/setupPushNotifications';
import { ContentNavigator } from './ContentNavigator';
import BottomNavBar from 'components/navBar/BottomNavBar';
import {
  useGetAllActionAlertsQuery,
  useGetAllAlertsQuery
} from 'reduxStore/services/api/alerts';
import {
  useGetTaskActionCompletionFormsQuery,
  useGetTaskCompletionFormsQuery
} from 'reduxStore/services/api/taskCompletionForms';
import { useGetAllRoutinesQuery } from 'reduxStore/services/api/routines';
import RoutineTasksScreen from 'screens/RoutineTasksScreen';
import { useGetAllTaskActionsQuery } from 'reduxStore/services/api/taskActions';
import {
  useGetAllEntitiesQuery,
  useGetMemberEntitiesQuery
} from 'reduxStore/services/api/entities';
import { useGetLastActivityViewQuery } from 'reduxStore/services/api/user';

import { useGetAllTagsQuery } from 'reduxStore/services/api/tags';
import MessagesNavigator from './MessagesNavigator';
import { BackOnlyHeaderWithSafeArea } from 'headers/BackOnlyHeader';
import ListsNavigator from 'components/organisms/ListsNavigator';
import AlertsList from 'components/organisms/AlertsList';
import NewItemsList from 'components/organisms/NewItemsList';
import QuickJot from 'components/organisms/QuickJot';
import OverdueTasksList from 'components/organisms/OverdueTasksList';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setEnforcedDate } from 'reduxStore/slices/calendars/actions';
import { useGetICalIntegrationsQuery } from 'reduxStore/services/api/externalCalendars';
import EventsList from 'components/organisms/EventsList';
import { useGetGuestListInviteeInvitesQuery } from 'reduxStore/services/api/guestListInvites';
import {
  useGetAllScheduledTasksQuery,
  useGetAllTasksQuery
} from 'reduxStore/services/api/tasks';
import { useThemeColor } from 'components/Themed';
import { Feather } from '@expo/vector-icons';

const styles = StyleSheet.create({
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    paddingVertical: 5,
  },
  barIconText: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '500',
  }
});

const BottomTab = createBottomTabNavigator<RootTabParamList>();

const BarIcon = ({
  focused,
  iconName,
  title
}: {
  focused: boolean;
  iconName: keyof typeof Feather.glyphMap;
  title: string;
}) => {
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const neutralColor = useThemeColor({}, 'neutral');
  const textColor = focused ? secondaryColor : neutralColor;

  return (
    <View style={styles.icon}>
      <Feather
        name={iconName}
        size={24}
        color={focused ? secondaryColor : neutralColor}
      />
      {focused ? (
        <PrimaryText text={title} style={[styles.barIconText, { color: textColor }]} />
      ) : (
        <AlmostBlackText text={title} style={[styles.barIconText, { color: textColor }]} />
      )}
    </View>
  );
};

export function BottomTabNavigator({
  hasJustSignedUp
}: {
  hasJustSignedUp: boolean;
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { data: userDetails } = useGetUserDetailsQuery();
  useGetUserInvitesQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: !userDetails?.user_id
  });
  useGetAllAlertsQuery(undefined, {
    skip: !userDetails?.user_id
  });
  useGetAllActionAlertsQuery(undefined, {
    skip: !userDetails?.user_id
  });
  useGetAllTaskActionsQuery(undefined, {
    skip: !userDetails?.user_id
  });
  useGetTaskCompletionFormsQuery(undefined, {
    skip: !userDetails?.user_id
  });
  useGetTaskActionCompletionFormsQuery(undefined, {
    skip: !userDetails?.user_id
  });
  useGetAllRoutinesQuery(undefined, {
    skip: !userDetails?.user_id
  });
  useGetMemberEntitiesQuery(undefined, {
    skip: !userDetails?.user_id
  });
  useGetAllEntitiesQuery(undefined, {
    skip: !userDetails?.user_id
  });
  useGetAllTagsQuery(undefined, {
    skip: !userDetails?.user_id
  });
  useGetCategorySetupCompletionsQuery(undefined, {
    skip: !userDetails?.user_id
  });
  useGetLastActivityViewQuery(undefined, {
    skip: !userDetails?.user_id
  });
  useGetICalIntegrationsQuery(undefined, {
    skip: !userDetails?.user_id
  });
  useGetGuestListInviteeInvitesQuery(undefined, {
    skip: !userDetails?.user_id,
    pollingInterval: 20000
  });
  useGetAllTasksQuery(undefined, {
    skip: !userDetails?.user_id
  });
  useGetAllScheduledTasksQuery(undefined, {
    skip: !userDetails?.user_id
  });

  useSetupPushNotifications();

  useEffect(() => {
    dispatch(setEnforcedDate({ date: '' }));
  }, [dispatch]);

  return (
    <BottomTab.Navigator
      initialRouteName={hasJustSignedUp ? 'ContentNavigator' : 'Home'}
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: 'Poppins-Bold'
        }
      }}
      backBehavior="history"
      tabBar={(props) => <BottomNavBar {...props} />}
    >
      <BottomTab.Screen
        name="Home"
        component={CalendarScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <BarIcon
              focused={focused}
              iconName="calendar"
              title={t('pageTitles.home')}
            />
          ),
          headerShown: false
        }}
      />
      <BottomTab.Screen
        name="ContentNavigator"
        component={ContentNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <BarIcon
              focused={focused}
              iconName="grid"
              title={t('pageTitles.categories')}
            />
          )
        }}
      />
      <BottomTab.Screen name="PlusButton" component={CalendarScreen} />
      <BottomTab.Screen
        name="Lists"
        component={ListsNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <BarIcon
              focused={focused}
              iconName="list"
              title={t('pageTitles.lists')}
            />
          ),
          header: BackOnlyHeaderWithSafeArea
        }}
      />
      <BottomTab.Screen
        name="Chat"
        component={MessagesNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <BarIcon
              focused={focused}
              iconName="zap"
              title={t('pageTitles.messages')}
            />
          )
        }}
      />
      <BottomTab.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{
          tabBarButton: () => null,
          title: t('pageTitles.oops')
        }}
      />
      <BottomTab.Screen
        name="EditTask"
        component={EditTaskScreen}
        options={{
          tabBarButton: () => null,
          title: t('pageTitles.editTask'),
          header: BackOnlyHeaderWithSafeArea
        }}
      />
      <BottomTab.Screen
        name="AddTask"
        component={AddTaskScreen}
        options={{
          tabBarButton: () => null,
          title: 'Add Task'
        }}
      />
      <BottomTab.Screen
        name="RoutineTasks"
        component={RoutineTasksScreen}
        options={{
          tabBarButton: () => null,
          title: '',
          header: BackOnlyHeaderWithSafeArea
        }}
      />
      <BottomTab.Screen
        name="Alerts"
        component={AlertsList}
        options={{
          tabBarButton: () => null,
          title: '',
          header: BackOnlyHeaderWithSafeArea
        }}
      />
      <BottomTab.Screen
        name="Events"
        component={EventsList}
        options={{
          tabBarButton: () => null,
          title: '',
          header: BackOnlyHeaderWithSafeArea
        }}
      />
      <BottomTab.Screen
        name="NewItems"
        component={NewItemsList}
        options={{
          tabBarButton: () => null,
          title: '',
          header: BackOnlyHeaderWithSafeArea
        }}
      />
      <BottomTab.Screen
        name="OverdueTasks"
        component={OverdueTasksList}
        options={{
          tabBarButton: () => null,
          title: '',
          header: BackOnlyHeaderWithSafeArea
        }}
      />
      <BottomTab.Screen
        name="QuickJot"
        component={QuickJot}
        options={{
          tabBarButton: () => null,
          title: '',
          header: BackOnlyHeaderWithSafeArea
        }}
      />
    </BottomTab.Navigator>
  );
}
