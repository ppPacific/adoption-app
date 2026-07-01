import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Tabs} from "expo-router";
import {tabs} from "@/constants/data"
import {View,Image} from "react-native";
import clsx from "clsx";
import {colors,components} from "@/constants/theme";
import {StyleSheet} from "react-native";


const tabBar = components.tabBar;
const TabIcon = ({focused, icon}: TabIconProps) => {
    return (
        <View style={styles.tabsIcon}>
            <View style={[styles.tabsPill, focused && styles.tabsActive]}>
                <Image source={icon} resizeMode="contain" style={styles.tabsGlyph}/>
            </View>
        </View>
    );
};
const TabLayout = () => {
    // const { isSignedIn, isLoaded } = useAuth();
    const insets = useSafeAreaInsets();

    // Wait for auth to load before rendering anything
    // if (!isLoaded) {
    //     return null;
    // }
    //
    // // Redirect to sign-in if user is not authenticated
    // if (!isSignedIn) {
    //     return <Redirect href="/(auth)/sign-in" />;
    // }

    return (
        <Tabs
            screenOptions={{headerShown: false,
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        position: 'absolute',
                        bottom: Math.max(insets.bottom, tabBar.horizontalInset),
                        height: tabBar.height,
                        marginHorizontal: tabBar.horizontalInset,
                        borderRadius: tabBar.radius,
                        backgroundColor: colors.primary,
                        borderTopWidth: 0,
                        elevation: 0,
                    },
                tabBarItemStyle: {
                    paddingVertical: tabBar.height / 2 - tabBar.iconFrame / 1.6
                },
                tabBarIconStyle: {
                    width: tabBar.iconFrame,
                    height: tabBar.iconFrame,
                    alignItems: 'center'
                }
            }}
        >
            {tabs.map((tab) => (
                <Tabs.Screen
                    key={tab.name}
                    name={tab.name}
                    options={{
                        title: tab.title,
                        tabBarIcon: ({focused}) => (
                            <TabIcon focused={focused} icon={tab.icon} />
                        )
                    }}/>
            ))}
        </Tabs>
    )
}
const styles = StyleSheet.create({
    tabsIcon: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabsPill: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 9999, // React Native handles perfect circles with large numbers
        backgroundColor: 'transparent',
    },
    tabsActive: {
        // Replace '#xx_YOUR_ACCENT_COLOR_xx' with your specific theme hexadecimal or rgb color code
        backgroundColor: '#007AFF',
    },
    tabsGlyph:{
        width: 20,  // Small icon size rule applied
        height: 20,
    }
});
export default TabLayout;
