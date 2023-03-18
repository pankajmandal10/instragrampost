import React, {useState, useMemo, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import instragramPostData from './data';

interface Post {
  id: number;
  userId: number;
  isFollowing: boolean;
  userName: string;
  image: string;
}

const App = () => {
  const dataSource: any = instragramPostData;
  const [posts, setPosts] = useState<Post[]>([]);
  const [following, setFollowing] = useState(false);
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 5;

  const getPaginatedData = () => {
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return dataSource.slice(startIndex, endIndex);
  };

  useEffect(() => {
    const newData = getPaginatedData();
    setPosts(prevData => [...prevData, ...newData]);
  }, [page]);

  const handleScrollEnd = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: any) => {
    const paddingToBottom = 10;
    const isHalfScrolled = 30 + 10 >= 30 / 2 - paddingToBottom;

    if (isHalfScrolled) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const memoizedPosts = useMemo(() => posts, [posts]);
  console.warn(posts.length);
  const renderDiagonosis = (item: Post) => {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image style={styles.avatar} source={{uri: item.image}} />
          <View style={styles.userInfo}>
            <Text style={styles.username}>{item.userName}</Text>
          </View>
        </View>
        <Image style={styles.postImage} source={{uri: item.image}} />
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => {
              const status = following ? false : true;
              setFollowing(status);
              posts.forEach(element => {
                if (item.userId === element.userId) {
                  console.warn(item.userId === element.userId);
                  element.isFollowing = element.isFollowing ? false : true;
                }
              });
            }}
            style={styles.followButton}>
            <Text style={styles.followButtonText}>
              {item.isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header1}>
        <Text style={{fontSize: 20, fontWeight: '800', color: 'black'}}>
          Instragram
        </Text>
      </View>
      <FlatList
        data={posts}
        renderItem={({item, index}) => renderDiagonosis(item)}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={handleScrollEnd}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  header1: {
    height: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  button: {
    backgroundColor: 'blue',
    color: 'black',
    padding: 10,
    alignSelf: 'center',
    margin: 10,
  },

  container: {
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  timestamp: {
    color: 'gray',
  },
  postImage: {
    width: '100%',
    height: 300,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  followButton: {
    backgroundColor: '#1877f2',
    borderRadius: 5,
    padding: 5,
  },
  followButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
