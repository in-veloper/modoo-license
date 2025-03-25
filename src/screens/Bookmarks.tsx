import { View } from 'react-native'
import { Text } from '@rneui/themed'
import { useEffect, useState } from 'react'
import { useCertStore } from '../stores/certStore'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Bookmarks = () => {
    const [bookmarkedTitles, setBookmarkedTitles] = useState<string[]>([])
    const certs = useCertStore((state) => state.certs)

    useEffect(() => {
        const loadBookmarks = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('@bookmarkedCerts')
                if(jsonValue !== null) {
                    const parsed = JSON.parse(jsonValue)
                    setBookmarkedTitles(parsed)
                    console.log('bookmark 목록 : ', parsed)
                }
            } catch (e) {
                console.error('bookmark 불러오기 실패', e)
            }
        }

        loadBookmarks()
    }, [])

    const filtered = certs.filter((cert) => bookmarkedTitles.includes(cert.title))

    return (
        <View>
            <Text>북마크 페이지</Text>
        </View>
    )
}

export default Bookmarks