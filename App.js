import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Button, Pressable, SafeAreaView, Text, View } from "react-native";
import { Client, Account, Databases, ID } from "react-native-appwrite";

const client = new Client();
client
	.setEndpoint("https://cloud.appwrite.io/v1")
	.setProject("665ac221001933fae933")
	.setPlatform("com.ppushups3.app");

const account = new Account(client);

const databases = new Databases(client);
const databaseId = "665ad9c300035632b448";
const collectionId = "665ad9e700196b45b0b4";

export default function App() {
	const [pushups, setPushups] = useState(0);
	// const [pushupsArray, setPushupsArray] = useState([]);

	const [today, setToday] = useState(getDayOfYear());  

       useEffect(() => {
			const checkDay = async () => {
				const td = getDayOfYear();

				if (td !== today) {
					setPushups(0);
					setToday(td);
				}

				await AsyncStorage.setItem("lastUsedDay", td.toString());
			};

			checkDay();
		}, [today]);




	

	async function savePushupstoDatabase() {
		try {
			const data = {
				pushups: pushups,
			};
			await databases.createDocument(
				databaseId,
				collectionId,
				ID.unique(),
				data
			);
			console.log("Pushups saved to database");
		} catch (e) {
			console.log(e);
		}
	}

	function getDayOfYear() {
		const now = new Date(); // Get the current date
		const start = new Date(now.getFullYear(), 0, 0); // Get the first day of the year
		const diff = now - start; // Calculate the difference in milliseconds
		const oneDay = 1000 * 60 * 60 * 24; // One day in milliseconds
		const dayOfYear = Math.floor(diff / oneDay); // Calculate the day of the year
		return dayOfYear;
	}

	return (
		<SafeAreaView className='flex-1 bg-gray-800'>
			<View className='flex-1 justify-center items-center'>
				<StatusBar style='auto' />
				<Pressable
					className='bg-yellow-500 rounded-full h-40 w-40 justify-center items-center mx-7'
					onPress={() => {
						setPushups(pushups + 1);
					}}
				>
					<Text className='text-4xl text-black font-bold '>
						Pushups:
					</Text>
					<Text className='text-4xl'>{pushups}</Text>
				</Pressable>
				{/* <Pressable
					className='bg-yellow-500 rounded-sm justify-center items-center  mx-7'
					onPress={() => setPushups(0)}
				>
					<Text className='text-xl m-2 text-black font-bold '>
						Reset
					</Text>
				</Pressable> */}
				{/* reset button */}
			</View>
			<Button title='Save' onPress={savePushupstoDatabase} />
		</SafeAreaView>
	);
}
