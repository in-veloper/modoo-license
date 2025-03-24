import React, { useRef, useState } from "react"
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Card, Text, ListItem } from '@rneui/themed'

const dummyData = [
    { id: '1', title: '한국사 능력검정', date: '2025-03-01' },
    { id: '2', title: '정보처리기사', date: '2025-03-24' },
    { id: '3', title: '빅데이터분석기사', date: '2025-04-05' }
]

const Dashboard = () => {
    const swipeRefs = useRef<{ [key: string]: any}>({})
    const [openItemId, setOpenItemId] = useState<string | null>(null)

    const onPressApply = (item: any) => {
        console.log(`${item.title} 원서접수`)
    }

    const handleSwipe = (id: string) => {
        if(openItemId && openItemId !== id) {
            swipeRefs.current[openItemId]?.close?.()
        }
        setOpenItemId(id)
    }

    return (
        <View style={styles.container}>
            <View style={styles.cardContainer}>
                <Card containerStyle={styles.card}>
                    <Card.Title>접수 예정 시험</Card.Title>
                    <Card.Divider />
                    {dummyData.map((item) => (
                        <ListItem.Swipeable
                            key={item.id}
                            ref={(ref: any) => (swipeRefs.current[item.id] = ref)}
                            onSwipeBegin={() => handleSwipe(item.id)}
                            style={styles.swipeItem}
                            containerStyle={styles.listItem}
                            rightWidth={80}
                            minSlideWidth={20}
                            leftWidth={0}
                            rightContent={() => (
                                <TouchableOpacity 
                                    style={styles.swipeBtn}
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
                </Card>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    card: {
        flex: 1,
        marginHorizontal: 4,
        overflow: 'hidden',
        borderRadius: 5
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
    swipeBtn: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f4f4",
        paddingHorizontal: 12,
        marginRight: 12,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        marginBottom: 1,
        marginTop: 1
    },
    swipeItem: {
        backgroundColor: "#fff",
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
})

export default Dashboard