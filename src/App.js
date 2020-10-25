import React, { useEffect, useState } from 'react';
import './App.css';
import Post from './Post';
import { auth, db } from './firebase';  
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);  

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState();
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser) {
        //user has logged in
        console.log(authUser);
        setUser(authUser);

        // if(authUser.displayName){
        //   //dont update
        // }else{
        //   //if we just created someone
        //   return authUser.updateProfile({
        //     displayName: username,
        //   })
        // }
      }else{
        //user logged out
        setUser(null);
      }
    })

    return () => {
      //perform some cleanup actions
      unsubscribe();
    }

  },[user, username])

  useEffect(() => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id, 
        post: doc.data()
      })));
    })
  },[])

  const signUp = (e) => {
    e.preventDefault();

    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message))
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
    .signInWithEmailAndPassword(email, password)
     .catch((error) => alert(error.message))

     setOpenSignIn(false);
  }

  return (
    <div className="app">

      <Modal
        open={open} onClose={() => setOpen(false)} 
      >
        <div style={modalStyle} className={classes.paper} >
          <form className='app_signup' >
            <center>
              <img 
                className="app_headerImage"
                src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                alt='' 
              />
            </center>
              <Input 
                placeholder='Username' type='text' value={username} onChange={(e) => setUsername(e.target.value) }
              />
              <Input 
                placeholder='Email' type='text' value={email} onChange={(e) => setEmail(e.target.value) }
              />
              <Input 
                placeholder='Password' type='password' value={password} onChange={(e) => setPassword(e.target.value) }
              />
              <Button type='submit' onClick={signUp} >Sign Up </Button>
          </form>
        </div>

      </Modal>

      <Modal
        open={openSignIn} onClose={() => setOpenSignIn(false)} 
      >
        <div style={modalStyle} className={classes.paper} >
          <form className='app_signup' >
            <center>
              <img 
                className="app_headerImage"
                src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                alt='' 
              />
            </center>
              <Input 
                placeholder='Email' type='text' value={email} onChange={(e) => setEmail(e.target.value) }
              />
              <Input 
                placeholder='Password' type='password' value={password} onChange={(e) => setPassword(e.target.value) }
              />
              <Button type='submit' onClick={signIn} >Sign In </Button>
          </form>
        </div>

      </Modal>

      <div className='app_header'>
        <img src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
          className='app_headerImage' alt=""
        />

        { user ? (
          <Button onClick={() => auth.signOut()} >Logout</Button>
        ):(
          <div className='app_loginContainer' >
            <Button onClick={() => setOpenSignIn(true)} >Sign In</Button>
            <Button onClick={() => setOpen(true)} >Sign Up</Button>
          </div> 
        )}

      </div>
      
      <div className='app_posts'>
        <div className='app_postsLeft' >
          {
            posts.map(({id, post}) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          }
        </div>
        <div className='app_postsRight' >
          <InstagramEmbed 
            url='https://www.instagram.com/p/BUze2OFggXH/'
            //url='https://www.instagram.com/p/Bx35DZDl1gG/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      {
        user?.displayName ? (
        <ImageUpload username={user.displayName} />
        ) : (
        <center><h3 className='app_h3' >Sorry you need to login to upload Post</h3></center>
      )}  
    </div>
  );
}

export default App;

// {
//   username: 'Shivraj',
//   caption: 'Wow its work',
//   imageUrl: 'https://hackernoon.com/images/z2xg2bpo.jpg'
// },
// {
//   username: 'Mark',
//   caption: 'I am CEO' ,
//   imageUrl: 'https://s3.india.com/wp-content/uploads/2020/05/Facebook-clear-history-tool.jpg'
// },
// {
//   username: 'Stark',
//   caption: 'Yoo, I am Iron man',
//   imageUrl: 'https://cnet2.cbsistatic.com/img/bZaqv6tPvT44-cop4ZL2gG3j5wE=/940x0/2020/01/17/7da55a03-ac5b-4ec1-b59b-6b3c2414e68b/egdt5idw4aittju.jpg'
// },