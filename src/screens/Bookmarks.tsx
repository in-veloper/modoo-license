import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text, Card, Button } from '@rneui/themed'
import { useEffect, useState } from 'react'
import { useCertStore } from '../stores/certStore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useBookmarkStore } from '../stores/bookmarkStore'

const Bookmarks = () => {
    const certs = useCertStore((state) => state.certs)
    const bookmarkedTitles = useBookmarkStore((state) => state.bookmarkedTitles)
    const loadBookmarks = useBookmarkStore((state) => state.loadBookmarks)
    const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark)

    useEffect(() => {
        loadBookmarks()
    }, [])

    const filtered = certs.filter((cert) => bookmarkedTitles.includes(cert.title))

    return (
        <SafeAreaView style={styles.safeContainer}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                {filtered.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>북마크된 자격증이 없습니다</Text>
                    </View>
                ) : (
                    filtered.map((item) => (
                        <View>
                            <Card
                                key={item.id}
                                containerStyle={styles.card}
                            >
                                <View style={styles.headerRow}>
                                    <Text style={styles.title}>{item.title}</Text>
                                    <TouchableOpacity onPress={() => toggleBookmark(item.title)}>
                                        <AntDesign name='star' size={20} color="#FFD700" />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.detailInfo}>
                                    <Text style={styles.label}>시험일자</Text>
                                    <Text style={styles.date}>{item.date}</Text>
                                </View>
                                <View style={styles.buttonGroup}>
                                    <Button title="홈페이지" size='sm' buttonStyle={styles.homepageButton} onPress={() => console.log(`${item.title} 홈페이지 클릭`)} />
                                    <Button title="접수" size='sm' buttonStyle={styles.applyButton} onPress={() => console.log(`${item.title} 접수 클릭`)} />
                                </View>
                            </Card>
                        </View>
                    ))
                )}
            </ScrollView>
            <View style={styles.adBanner}>
                <Text style={styles.adText}>배너 광고 영역</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#FFF',
        marginTop: 20
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 24,
        color: '#888',
        fontSize: 20,
        fontWeight: 'bold'
    },
    card: {
        borderRadius: 8,
        padding: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 14,
        color: '#333',
    },
    date: {
        fontSize: 14,
        color: '#333',
    },
    detailInfo: {
        flexDirection: 'row',
        marginTop: 8,
        marginBottom: 8,
        alignItems: 'center',
        gap: 7
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 5
    },
    homepageButton: {
        borderRadius: 3,
        backgroundColor: '#4CAF50'
    },
    applyButton: {
        borderRadius: 3,
        backgroundColor: '#4CAF50'
    },
    adBanner: {
        height: 60,
        backgroundColor: '#EEE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    adText: {
        fontSize: 14,
        color: '#777',
    },
})

export default Bookmarks