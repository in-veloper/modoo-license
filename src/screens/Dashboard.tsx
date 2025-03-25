import React, { useEffect, useRef, useState } from "react"
import { View, StyleSheet, TouchableOpacity, ScrollView, TouchableHighlight, SafeAreaView } from 'react-native'
import { Card, Text, ListItem, SearchBar, Button } from '@rneui/themed'
import AntDesign from 'react-native-vector-icons/AntDesign'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCertStore } from "../stores/certStore"
import { useBookmarkStore } from "../stores/bookmarkStore"

const dummyData = [
    { id: '1', title: '한국사 능력검정', date: '2025-03-01' },
    { id: '2', title: '정보처리기사', date: '2025-03-24' },
    { id: '3', title: '빅데이터분석기사', date: '2025-04-05' },
    { id: '4', title: 'SQL 전문가', date: '2025-03-28' },
    { id: '5', title: '데이터 아키텍처 전문가', date: '2025-03-25' },
]

const Dashboard = () => {
    const [searchText, setSearchText] = useState("")
    const swipeRefs = useRef<{ [key: string]: any}>({})
    const [openItemId, setOpenItemId] = useState<string | null>(null)
    // const [bookmarkedTitles, setBookmarkedTitles] = useState<string[]>([])
    const [showSearchDropdown, setShowSearchDropdown] = useState(false)
    const bookmarkedTitles = useBookmarkStore((state) => state.bookmarkedTitles)
    const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark)
    const loadBookmarks = useBookmarkStore((state) => state.loadBookmarks)

    const onPressApply = (item: any) => {
        console.log(`${item.title} 원서접수`)
    }
    
    const onPressBookmark = (item: any) => {
        console.log(`${item.title} 북마크`)
        toggleBookmark(item.title)
    }

    const handleSwipe = (id: string) => {
        if(openItemId && openItemId !== id) {
            swipeRefs.current[openItemId]?.close?.()
        }
        setOpenItemId(id)
    }

    const changeSearchText = (searchText: string) => {
        setSearchText(searchText)
        setShowSearchDropdown(searchText.trim().length > 0)
    }

    useEffect(() => {
        loadBookmarks()
        useCertStore.getState().setCerts(dummyData)
    }, [])

    const onPressSearchItem = (searchItem: string) => {
        setSearchText(searchItem)
        setShowSearchDropdown(false)
    }

    const filteredData = dummyData.filter((item) => item.title.toLowerCase().includes(searchText.toLowerCase()))

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <View style={styles.searchWrapper}>
                    <SearchBar
                        lightTheme={true}
                        placeholder="자격증명을 입력하세요"
                        onChangeText={changeSearchText}
                        value={searchText}
                        containerStyle={styles.searchBarContainer}
                        inputContainerStyle={styles.searchBarInputContainer}
                        inputStyle={styles.searchBarInput}
                    />
                    {searchText.trim().length > 0 && showSearchDropdown && (
                        <View style={styles.searchDropdown}>
                            <ScrollView
                                nestedScrollEnabled={true}
                                style={styles.searchScroll}
                            >
                                {filteredData.length === 0 ? (
                                    <Text style={styles.emptySearchText}>일치하는 자격증이 없습니다</Text>
                                ) : (
                                    filteredData.map((item: any) => (
                                        <TouchableHighlight
                                            key={`search-${item.id}`}
                                            style={styles.searchItem}
                                            underlayColor="#F0F0F0"
                                            onPress={() => onPressSearchItem(item.title)}
                                        >
                                            <Text style={styles.searchItemText}>{item.title}</Text>
                                        </TouchableHighlight>
                                    ))
                                )}
                            </ScrollView>
                        </View>
                    )}
                </View>
                <View style={styles.cardContainer}>
                    <Card containerStyle={styles.todayCard}>
                        <Card.Title>오늘 접수 자격증 시험</Card.Title>
                        <Card.Divider />
                        <ScrollView
                            nestedScrollEnabled={true}
                            style={styles.cardScrollView}
                            showsVerticalScrollIndicator={false}
                        >
                            {dummyData.map((item) => (
                                <ListItem
                                    key={item.id}
                                    style={styles.swipeItem}
                                    containerStyle={styles.todayListItem}
                                >
                                    <View style={styles.listRow}>
                                        <ListItem.Content>
                                            <ListItem.Title style={styles.title}>{item.title}</ListItem.Title>
                                        </ListItem.Content>
                                        <TouchableOpacity
                                            style={styles.applyButton}
                                            onPress={() => onPressApply(item)}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={styles.applyButtonText}>접수</Text>
                                        </TouchableOpacity>
                                        {/* <Text style={styles.date}>{item.date}</Text> */}
                                    </View>
                                </ListItem>
                            ))}
                        </ScrollView>
                    </Card>
                    <Card containerStyle={styles.tbaCard}>
                        <Card.Title>이번달 접수 예정 자격증 시험</Card.Title>
                        <Card.Divider />
                        <ScrollView
                            nestedScrollEnabled={true}
                            style={styles.cardScrollView}
                            showsVerticalScrollIndicator={false}
                        >
                            {dummyData.map((item) => (
                                <ListItem.Swipeable
                                    key={item.id}
                                    ref={(ref: any) => (swipeRefs.current[item.id] = ref)}
                                    onSwipeBegin={() => handleSwipe(item.id)}
                                    style={styles.swipeItem}
                                    containerStyle={styles.listItem}
                                    rightWidth={80}
                                    minSlideWidth={20}
                                    leftWidth={80}
                                    leftContent={() => {
                                        const isBookmarked = bookmarkedTitles.includes(item.title)
                                        return (
                                            <TouchableOpacity
                                                style={styles.leftSwipeBtn}
                                                onPress={() => onPressBookmark(item)}
                                                activeOpacity={0.7}
                                            >
                                                <AntDesign name={isBookmarked ? "star" : "staro"} size={20} color="#FFD700"/>
                                            </TouchableOpacity>
                                        )
                                    }}
                                    rightContent={() => (
                                        <TouchableOpacity 
                                            style={styles.rightSwipeBtn}
                                            onPress={() => onPressApply(item)}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={styles.swipeText}>접수</Text>
                                        </TouchableOpacity>
                                    )}
                                >
                                    <View style={styles.listRow}>
                                        <ListItem.Content>
                                            <ListItem.Title style={styles.title}>{item.title}</ListItem.Title>
                                        </ListItem.Content>
                                        <Text style={styles.date}>{item.date}</Text>
                                    </View>
                                </ListItem.Swipeable>
                            ))}
                        </ScrollView>
                    </Card>
                    <Card containerStyle={styles.tbaCard}>
                        <Card.Title>다음달 접수 예정 자격증 시험</Card.Title>
                        <Card.Divider />
                        <ScrollView
                            nestedScrollEnabled={true}
                            style={styles.cardScrollView}
                            showsVerticalScrollIndicator={false}
                        >
                            {dummyData.map((item) => (
                                <ListItem.Swipeable
                                    key={item.id}
                                    ref={(ref: any) => (swipeRefs.current[item.id] = ref)}
                                    onSwipeBegin={() => handleSwipe(item.id)}
                                    style={styles.swipeItem}
                                    containerStyle={styles.listItem}
                                    rightWidth={80}
                                    minSlideWidth={20}
                                    leftWidth={80}
                                    leftContent={() => {
                                        const isBookmarked = bookmarkedTitles.includes(item.title)
                                        return (
                                            <TouchableOpacity
                                                style={styles.leftSwipeBtn}
                                                onPress={() => onPressBookmark(item)}
                                                activeOpacity={0.7}
                                            >
                                                <AntDesign name={isBookmarked ? "star" : "staro"} size={20} color="#FFD700"/>
                                            </TouchableOpacity>
                                        )
                                    }}
                                    rightContent={() => (
                                        <TouchableOpacity 
                                            style={styles.rightSwipeBtn}
                                            onPress={() => onPressApply(item)}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={styles.swipeText}>접수</Text>
                                        </TouchableOpacity>
                                    )}
                                >
                                    <View style={styles.listRow}>
                                        <ListItem.Content>
                                            <ListItem.Title style={styles.title}>{item.title}</ListItem.Title>
                                        </ListItem.Content>
                                        <Text style={styles.date}>{item.date}</Text>
                                    </View>
                                </ListItem.Swipeable>
                            ))}
                        </ScrollView>
                    </Card>
                    <Card containerStyle={styles.tbaCard}>
                        <Card.Title>올해 접수 예정 자격증 시험</Card.Title>
                        <Card.Divider />
                        <ScrollView
                            nestedScrollEnabled={true}
                            style={styles.cardScrollView}
                            showsVerticalScrollIndicator={false}
                        >
                            {dummyData.map((item) => (
                                <ListItem.Swipeable
                                    key={item.id}
                                    ref={(ref: any) => (swipeRefs.current[item.id] = ref)}
                                    onSwipeBegin={() => handleSwipe(item.id)}
                                    style={styles.swipeItem}
                                    containerStyle={styles.listItem}
                                    rightWidth={80}
                                    minSlideWidth={20}
                                    leftWidth={80}
                                    leftContent={() => {
                                        const isBookmarked = bookmarkedTitles.includes(item.title)
                                        return (
                                            <TouchableOpacity
                                                style={styles.leftSwipeBtn}
                                                onPress={() => onPressBookmark(item)}
                                                activeOpacity={0.7}
                                            >
                                                <AntDesign name={isBookmarked ? "star" : "staro"} size={20} color="#FFD700"/>
                                            </TouchableOpacity>
                                        )
                                    }}
                                    rightContent={() => (
                                        <TouchableOpacity 
                                            style={styles.rightSwipeBtn}
                                            onPress={() => onPressApply(item)}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={styles.swipeText}>접수</Text>
                                        </TouchableOpacity>
                                    )}
                                >
                                    <View style={styles.listRow}>
                                        <ListItem.Content>
                                            <ListItem.Title style={styles.title}>{item.title}</ListItem.Title>
                                        </ListItem.Content>
                                        <Text style={styles.date}>{item.date}</Text>
                                    </View>
                                </ListItem.Swipeable>
                            ))}
                        </ScrollView>
                    </Card>
                    <Card containerStyle={styles.bookmarkCard}>
                        <Card.Title>북마크한 자격증 시험</Card.Title>
                        <Card.Divider />
                        {bookmarkedTitles.length === 0 ? (
                            <View style={styles.emptyBookmarkContainer}>
                                <Text style={styles.emptyBookmarkText}>북마크한 시험 내역이 없습니다</Text>

                            </View>
                        ) : (
                            <ScrollView
                                nestedScrollEnabled={true}
                                style={styles.cardScrollView}
                                showsVerticalScrollIndicator={false}
                            >
                                {dummyData
                                    .filter((item) => bookmarkedTitles.includes(item.title))
                                    .map((item) => (
                                        <ListItem.Swipeable
                                            key={`bm-${item.id}`}
                                            ref={(ref: any) => (swipeRefs.current[`bm-${item.id}`] = ref)}
                                            onSwipeBegin={() => handleSwipe(`bm-${item.id}`)}
                                            style={styles.swipeItem}
                                            containerStyle={styles.listItem}
                                            rightWidth={80}
                                            minSlideWidth={20}
                                            leftWidth={80}
                                            leftContent={() => {
                                                const isBookmarked = bookmarkedTitles.includes(item.title)
                                                return (
                                                    <TouchableOpacity
                                                        style={styles.leftSwipeBtn}
                                                        onPress={() => onPressBookmark(item)}
                                                        activeOpacity={0.7}
                                                    >
                                                        <AntDesign 
                                                            name={isBookmarked ? "star" : "staro"}
                                                            size={20}
                                                            color="#FFD700"
                                                        />
                                                    </TouchableOpacity>
                                                )
                                            }}
                                            rightContent={() => (
                                                <TouchableOpacity
                                                    style={styles.rightSwipeBtn}
                                                    onPress={() => onPressApply(item)}
                                                    activeOpacity={0.7}
                                                >
                                                    <Text style={styles.swipeText}>접수</Text>
                                                </TouchableOpacity>
                                            )}
                                        >
                                            <View style={styles.listRow}>
                                                <ListItem.Content>
                                                    <ListItem.Title style={styles.title}>{item.title}</ListItem.Title>
                                                </ListItem.Content>
                                                <Text style={styles.date}>{item.date}</Text>
                                            </View>
                                        </ListItem.Swipeable>
                                    ))
                                }
                            </ScrollView>
                        )}
                    </Card>
                </View>
            </View>
            <View style={styles.adBanner}>
                <Text style={styles.adText}>배너 광고 영역</Text>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    searchBarContainer: {
        backgroundColor: '#FFF',
        padding: 0,
        marginTop: 20,
        borderColor: '#CCC',
        borderWidth: 1,
        borderRadius: 5,
        marginLeft: 3,
        marginRight: 3,
    },
    searchScroll: {
        maxHeight: 150
    },
    searchBarInputContainer: {
        backgroundColor: '#FFF',
    },
    searchBarInput: {
        color: '#000',
        fontSize: 17
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FFF',
    },
    cardContainer: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    todayCard: {
        marginHorizontal: 4,
        overflow: 'hidden',
        borderRadius: 5,
        borderColor: '#F08080'
    },
    tbaCard: {
        marginHorizontal: 4,
        overflow: 'hidden',
        borderRadius: 5,
        borderColor: '#4CAF50'
    },
    todayListItem: {
        paddingVertical: 5,
    },
    listItem: {
        paddingVertical: 7,
    },
    content: {
        paddingVertical: 0,
        marginVertical: 0,
    },
    title: {
        fontSize: 14,
    },
    date: {
        fontSize: 14
    },
    leftSwipeBtn: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F4F4F4",
        paddingHorizontal: 12,
        marginRight: 12,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        marginBottom: 1,
        marginTop: 1
    },
    rightSwipeBtn: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F4F4F4",
        paddingHorizontal: 12,
        marginRight: 12,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        marginBottom: 1,
        marginTop: 1
    },
    swipeItem: {
        backgroundColor: "#FFF",
    },
    swipeText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    listRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardScrollView: {
        maxHeight: 165
    },
    bookmarkCard: {
        marginHorizontal: 4,
        overflow: 'hidden',
        borderRadius: 5,
        borderColor: '#FFA726'
    },
    emptyBookmarkContainer: {
        padding: 7,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyBookmarkText: {
        fontSize: 14,
        color: '#999',
    },
    searchWrapper: {
        position: 'relative',
        zIndex: 10,
    },
    searchDropdown: {
        position: 'absolute',
        backgroundColor: '#FFF',
        borderColor: '#CCC',
        top: 70,
        left: 0,
        right: 0,
        borderWidth: 1,
        borderRadius: 5,
        marginHorizontal: 3,
        marginTop: 1,
        paddingVertical: 4,
        maxHeight: 150,
        elevation: 3, 
        zIndex: 1000, 
    },
    searchItem: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#FFF'
    },
    searchItemText: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    emptySearchText: {
        padding: 12,
        fontSize: 14,
        color: '#888',
    },
    applyButton: {
        backgroundColor: '#FF6347',
        paddingHorizontal: 12,
        paddingVertical: 3,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
      
    applyButtonText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: 'bold',
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

export default Dashboard