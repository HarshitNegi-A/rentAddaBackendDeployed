const express=require('express')
const cors=require('cors')
const User=require('./model/UserModel')
const Item=require('./model/ItemModel')
const bookingRoutes=require('./routes/bookingRoutes')
const signupRoutes=require('./routes/signupRoute')
const sequelize=require('./db')
const orderRoutes=require('./routes/orderRoutes')
const itemRoutes=require('./routes/itemRoutes')
const Booking = require('./model/BookingModel')
const ChatRoom = require("./model/chatRoom");
const Message = require("./model/Message");
const chatRoutes = require("./routes/chatRoutes");
const app=express()
app.use(cors({
    origin:'https://rentadda.netlify.app',
    methods:['GET','POST','PUT','DELETE'],
    credentials:true
}))
// app.options("*", cors());
app.use(express.json())

User.hasMany(Item,{foreignKey:"userId"})
Item.belongsTo(User,{foreignKey:"userId"})

User.hasMany(Booking, { foreignKey: "userId" });
Booking.belongsTo(User, { foreignKey: "userId" });

Item.hasMany(Booking, { foreignKey: "itemId" });
Booking.belongsTo(Item, { foreignKey: "itemId" });

ChatRoom.hasMany(Message, { foreignKey: "chatRoomId" });
Message.belongsTo(ChatRoom, { foreignKey: "chatRoomId" });

Booking.hasOne(ChatRoom, { foreignKey: "bookingId" });
ChatRoom.belongsTo(Booking, { foreignKey: "bookingId" });

app.use('/',signupRoutes)
app.use('/items',itemRoutes)
app.use("/bookings", bookingRoutes);
app.use("/orders", orderRoutes);
app.use("/chat", chatRoutes);
sequelize.sync()
.then(()=>{
    console.log("MySQL connected")
    app.listen(3000,()=>console.log("Server started at 3000"))
})
.catch(err => console.log("DB error", err))