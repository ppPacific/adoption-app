import { Text, View } from "react-native";
import "@/global.css"
import {Link} from "expo-router";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import {styled} from "nativewind";

const SafeAreaView = styled(RNSafeAreaView)//enable classname support
export default function Index() {
  return (
      <SafeAreaView className="flex-1 bg-background p-5">
          <Text className="text-xl font-bold text-blue-500">
              Welcome to Nativewind!
          </Text>
          <Link href={'/'} className={`mt-4 rounded bg-primary text-white p-4`}>to home</Link>
          <Link href={'/(auth)/sign-in'} className={`mt-4 rounded bg-primary text-white p-4`}>to sign in</Link>
          <Link href={'/(auth)/sign-up'} className={`mt-4 rounded bg-primary text-white p-4`}>to sign up</Link>

          <Link href={'/doggie/Karin'} className={`mt-4 rounded bg-primary text-white p-4`}>Karin</Link>
          <Link href={{
              pathname: '/doggie/[id]',
              params: {id:"karin"}
          }}
                className={`mt-4 rounded bg-primary text-white p-4`}>see doggie</Link>

      </SafeAreaView>
  );
}
