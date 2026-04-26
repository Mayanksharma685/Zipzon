import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Link } from "expo-router";
import { useSignUp } from '@clerk/clerk-expo'
import { COLORS } from "@/constants";

export default function SignUpScreen() {
    const { signUp, setActive, isLoaded } = useSignUp();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [code, setCode] = useState("");
    const [pendingVerification, setPendingVerification] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSignUpPress = async () => {
        if (!isLoaded || !signUp) return;

        if (!emailAddress || !password || !firstName || !lastName) {
            Toast.show({
                type: 'error',
                text1: 'Missing Fields',
                text2: 'Please fill in all fields'
            });
            return;
        }

        setLoading(true);
        try {
            await signUp.create({
                emailAddress,
                password,
                firstName,
                lastName,
            });

            await signUp.prepareEmailAddressVerification({
                strategy: "email_code",
            });

            setPendingVerification(true);

        } catch (err: any) {
            let message = "Something went wrong";

            if (err?.errors && err.errors.length > 0) {
                message = err.errors[0].longMessage || err.errors[0].message;
            }

            Toast.show({
                type: 'error',
                text1: 'Failed to Sign Up',
                text2: message
            });
        } finally {
            setLoading(false);
        }
    };

    const onVerifyPress = async () => {
        if (!isLoaded || !signUp || !setActive) return;

        if (!code) {
            Toast.show({
                type: 'error',
                text1: 'Missing Fields',
                text2: 'Enter verification code'
            });
            return;
        }

        setLoading(true);
        try {
            const attempt = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (attempt.status === "complete") {
                await setActive({ session: attempt.createdSessionId });
                router.replace("/");
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Verification incomplete'
                });
            }
        } catch (err: any) {
            let message = "Invalid code";

            if (err?.errors && err.errors.length > 0) {
                message = err.errors[0].longMessage || err.errors[0].message;
            }

            Toast.show({
                type: 'error',
                text1: 'Failed to Verify',
                text2: message
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 justify-center bg-[#0F172A]" style={{ padding: 20 }}>

            {/* Back Button */}
            <TouchableOpacity onPress={() => router.push("/")} className="absolute top-12 left-6 z-10">
                <Ionicons name="arrow-back" size={26} color="#fff" />
            </TouchableOpacity>

            {!pendingVerification ? (
                <View className="bg-[#111827] rounded-3xl p-6 shadow-lg">

                    {/* Header */}
                    <View className="items-center mb-10 w-full">
                        <Text className="text-5xl font-extrabold text-white text-center tracking-wide">
                            Zip<Text className="text-[#4F46E5]">Zon</Text>
                        </Text>

                        <Text className="text-gray-500 text-xs mt-1 tracking-wide">
                            Created by Mayank Sharma
                        </Text>

                        <View className="w-14 h-[3px] bg-[#4F46E5] rounded-full mt-3 mb-4" />

                        <Text className="text-gray-400 text-center text-sm px-6 leading-5">
                            Create your account ✨{"\n"}
                            Join ZipZon and get started
                        </Text>
                    </View>

                    {/* Inputs */}
                    <View className="mb-3">
                        <Text className="text-gray-300 mb-1">First Name</Text>
                        <TextInput
                            className="bg-[#1F2937] p-4 rounded-xl text-white"
                            placeholder="John"
                            placeholderTextColor="#6B7280"
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                    </View>

                    <View className="mb-3">
                        <Text className="text-gray-300 mb-1">Last Name</Text>
                        <TextInput
                            className="bg-[#1F2937] p-4 rounded-xl text-white"
                            placeholder="Doe"
                            placeholderTextColor="#6B7280"
                            value={lastName}
                            onChangeText={setLastName}
                        />
                    </View>

                    <View className="mb-3">
                        <Text className="text-gray-300 mb-1">Email</Text>
                        <TextInput
                            className="bg-[#1F2937] p-4 rounded-xl text-white"
                            placeholder="user@example.com"
                            placeholderTextColor="#6B7280"
                            value={emailAddress}
                            onChangeText={setEmailAddress}
                        />
                    </View>

                    <View className="mb-5">
                        <Text className="text-gray-300 mb-1">Password</Text>
                        <TextInput
                            className="bg-[#1F2937] p-4 rounded-xl text-white"
                            placeholder="********"
                            placeholderTextColor="#6B7280"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    {/* Button */}
                    <TouchableOpacity
                        className={`py-4 rounded-xl items-center ${
                            loading ? "bg-gray-600" : "bg-[#4F46E5]"
                        }`}
                        onPress={onSignUpPress}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text className="text-white font-bold text-lg">Continue</Text>
                        )}
                    </TouchableOpacity>

                    {/* Footer */}
                    <View className="flex-row justify-center mt-6">
                        <Text className="text-gray-400">Already have an account? </Text>
                        <Link href="/sign-in">
                            <Text className="text-[#4F46E5] font-bold">Login</Text>
                        </Link>
                    </View>

                </View>
            ) : (
                <View className="bg-[#111827] rounded-3xl p-6 shadow-lg">

                    {/* Header */}
                    <View className="items-center mb-10 w-full">
                        <Text className="text-5xl font-extrabold text-white text-center tracking-wide">
                            Zip<Text className="text-[#4F46E5]">Zon</Text>
                        </Text>

                        <Text className="text-gray-500 text-xs mt-1 tracking-wide">
                            Created by Mayank Sharma
                        </Text>

                        <View className="w-14 h-[3px] bg-[#4F46E5] rounded-full mt-3 mb-4" />

                        <Text className="text-gray-400 text-center text-sm px-6 leading-5">
                            Verify your email 🔐{"\n"}
                            Enter the code sent to you
                        </Text>
                    </View>

                    <TextInput
                        className="bg-[#1F2937] p-4 rounded-xl text-white text-center text-lg tracking-widest mb-5"
                        placeholder="123456"
                        placeholderTextColor="#6B7280"
                        value={code}
                        onChangeText={setCode}
                    />

                    <TouchableOpacity
                        className="bg-[#4F46E5] py-4 rounded-xl items-center"
                        onPress={onVerifyPress}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text className="text-white font-bold text-lg">Verify</Text>
                        )}
                    </TouchableOpacity>

                </View>
            )}
        </SafeAreaView>
    );
}