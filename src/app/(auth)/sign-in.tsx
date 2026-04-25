import { COLORS } from "@/constants";
import { useSignIn } from "@clerk/clerk-expo";
import type { EmailCodeFactor } from "@clerk/types";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import * as React from "react";
import {
  Pressable,
  TextInput,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [showEmailCode, setShowEmailCode] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onSignInPress = async () => {
    if (!isLoaded || !signIn) return;  
    if (!emailAddress || !password) return;

    setLoading(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        if (!setActive) return;  
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else if (signInAttempt.status === "needs_second_factor") {
        const emailCodeFactor = signInAttempt.supportedSecondFactors?.find(
          (factor): factor is EmailCodeFactor =>
            factor.strategy === "email_code",
        );

        if (emailCodeFactor) {
          await signIn.prepareSecondFactor({
            strategy: "email_code",
            emailAddressId: emailCodeFactor.emailAddressId,
          });

          setShowEmailCode(true);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded || !signIn) return;  
    if (!code) return;

    setLoading(true);
    try {
      const attempt = await signIn.attemptSecondFactor({
        strategy: "email_code",
        code,
      });

      if (attempt.status === "complete") {
        if (!setActive) return;  
        await setActive({ session: attempt.createdSessionId });
        router.replace("/");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 justify-center bg-[#0F172A]"
      style={{ padding: 20 }}
    >
      {/* Back */}
      <TouchableOpacity
        onPress={() => router.push("/")}
        className="absolute top-12 left-6 z-10"
      >
        <Ionicons name="arrow-back" size={26} color="#fff" />
      </TouchableOpacity>

      {!showEmailCode ? (
        <View className="bg-white rounded-3xl p-6 shadow-lg">
          {/* Header */}
          <View className="items-center mb-10 w-full">
            {/* Title */}
            <Text className="text-5xl font-extrabold text-white text-center tracking-wide">
              <Text className="text-[#4F46E5]">ZipZon</Text>
            </Text>

            {/* Creator Line */}
            <Text className="text-gray-500 text-xs mt-1 tracking-wide">
              Created by Mayank Sharma
            </Text>

            {/* Accent Line */}
            <View className="w-14 h-[3px] bg-[#4F46E5] rounded-full mt-3 mb-4" />

            {/* Subtitle */}
            <Text className="text-gray-400 text-center text-sm px-6 leading-5">
              Welcome back 👋{"\n"}
              Sign in to your account
            </Text>
          </View>
          {/* Email */}
          <View className="mb-4">
            <Text className="font-semibold text-[#0F172A] mb-1">Email</Text>
            <TextInput
              className="bg-gray-100 p-4 rounded-2xl"
              placeholder="user@example.com"
              value={emailAddress}
              onChangeText={setEmailAddress}
            />
          </View>

          {/* Password */}
          <View className="mb-6">
            <Text className="font-semibold text-[#0F172A] mb-1">Password</Text>
            <TextInput
              className="bg-gray-100 p-4 rounded-2xl"
              placeholder="********"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Button */}
          <Pressable
            className={`py-4 rounded-2xl items-center ${
              loading || !emailAddress || !password
                ? "bg-gray-400"
                : "bg-[#4F46E5]"
            }`}
            onPress={onSignInPress}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">Sign In</Text>
            )}
          </Pressable>

          {/* Footer */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-500">New to ZipZon? </Text>
            <Link href="/sign-up">
              <Text className="text-[#4F46E5] font-bold">Create Account</Text>
            </Link>
          </View>
        </View>
      ) : (
        <View className="bg-white rounded-3xl p-6 shadow-lg">
          {/* Verify */}
          <View className="items-center mb-8">
            <Text className="text-3xl font-extrabold text-[#0F172A] mb-2">
              Verify Email 🔐
            </Text>
            <Text className="text-gray-500 text-center">
              Enter the code sent to your email
            </Text>
          </View>

          <TextInput
            className="bg-gray-100 p-4 rounded-2xl text-center text-lg tracking-widest mb-5"
            placeholder="123456"
            keyboardType="number-pad"
            value={code}
            onChangeText={setCode}
          />

          <Pressable
            className="bg-[#4F46E5] py-4 rounded-2xl items-center"
            onPress={onVerifyPress}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">Verify</Text>
            )}
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
