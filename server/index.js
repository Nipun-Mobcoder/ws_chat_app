const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const connectDB = require("./config/db");
const Users = require('./models/Users');
const Messages = require('./models/Messages');
const Conversation = require('./models/Conversation');

dotenv.config();

const app = express();

app.use(express.json());
const bcrypt = bcryptjs.genSaltSync(10);

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.use(
    cors({
      credentials: true,
      origin: "http://localhost:5173",
    })
  );

app.post('/register', async (req, res) => {
    try {
        const {fullName, email, password} = req.body;

        const isAlreadyExist = await Users.findOne({email});
        if(isAlreadyExist) res.status(400).send('User already exists');
        else {
            const pass = await bcryptjs.hash(password, bcrypt);
            const userDoc = await Users.create({ fullName, email, password: pass});
            return res.status(200).json(userDoc);
        }
    } catch(error) {
        console.log(error);
        return res.status(400).send(error.message);
    }
})

app.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await Users.findOne({ email });
        if(!user) return res.send("User not found");
        else {
            const validateUser = bcryptjs.compare(password, user.password);
            if(!validateUser) return res.send("Password incorrect");

            jwt.sign({
                id: user._id,
                email: user.email
                }, process.env.JWT_Secret, { expiresIn: 84600 }, async (err, token) => {
                    await Users.updateOne({ _id: user._id }, {
                        $set: { token }
                    })
                user.save();
                return res.status(200).json({ user: { id: user._id, email: user.email, fullName: user.fullName }, token: token })
                }
            )
        }
    }
    catch(error) {
        console.log(error);
        return res.status(400).send(error.message);
    }
})

app.post('/conversation', async (req, res) => {
    try {
        const { senderId, recieverId } = req.body;
        const converse = await Conversation.create({members: [senderId, recieverId]})

        return res.status(200).json(converse);
    }
    catch(e) {
        console.log(e);
        res.status(400).send(e.message);
    }
})

app.get('/conversation/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const conversations = await Conversation.find({ members: { $in: [userId] } })
        
        const conversationUserData = Promise.all(conversations.map(async (conversation) => {
            const receiverId = conversation.members.find((member) => member !== userId);
            const user = await Users.findById(receiverId);
            return { user: { receiverId: user._id, email: user.email, fullName: user.fullName }, conversationId: conversation._id }
        }))
        res.status(200).json(await conversationUserData);
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e.message);
    }
})

app.post('/message', async (req, res) => {
    try {
        const { conversationId, senderId, message, receiverId = '' } = req.body;
        if (!senderId || !message) return res.status(400).send('Please fill all required fields')
        if (conversationId === 'new' && receiverId) {
            const newCoversation = await Conversations.create({ members: [senderId, receiverId] });
            const newMessage = await Messages.create({ conversationId: newCoversation._id, senderId, message });
            return res.status(200).json(newMessage);
        } else if ((!conversationId || conversationId === 'new') && !receiverId) {
            return res.status(400).send('Please fill all required fields')
        }

        const messageData = await Messages.create( { message, conversationId, senderId } )
        res.status(200).json(messageData);
    } catch (e) {
        console.log(e);
        res.status(400).send(e.message);
    }
})

app.get('/message/:conversationId', async (req, res) => {
    try {
        const checkMessages = async (conversationId) => {
            console.log(conversationId, 'conversationId')
            const messages = await Messages.find({ conversationId });
            const messageUserData = Promise.all(messages.map(async (message) => {
                const user = await Users.findById(message.senderId);
                return { user: { id: user._id, email: user.email, fullName: user.fullName }, message: message.message }
            }));
            res.status(200).json(await messageUserData);
        }
        const conversationId = req.params.conversationId;
        if (conversationId === 'new') {
            const checkConversation = await Conversations.find({ members: { $all: [req.query.senderId, req.query.receiverId] } });
            if (checkConversation.length > 0) {
                console.log(checkConversation)
                checkMessages(checkConversation[0]._id);
            } else {
                return res.status(200).json([])
            }
        } else {
            checkMessages(conversationId);
        }
    } catch (error) {
        console.log('Error', error)
        res.send(error.message);
    }
})

connectDB();
app.listen(4000, () => console.log("App listening on http://localhost:4000"));