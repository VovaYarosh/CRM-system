const moment = require('moment')

const Order = require('../models/Order');
const errorHandler = require('../utils/errorHandler');

module.exports.overview = async function (req,res) {
    try {
        const allOrders = await Order.find({user: req.user.id}).sort({date: 1});
        const ordersMap = getOrdersMap(allOrders);
        const yesterdayOrders = ordersMap[moment().add(-1, 'd').format('DD.MM.YYYY')] || [];

        //quantity of yesterdays orders
        const yesterdayOrdersNumber = yesterdayOrders.length;
        //orders quantity
        const  totalOrdersNumber = allOrders.length;
        //quantity of days
        const daysNumber = Object.keys(ordersMap).length;
        //days quantity of orders
        const ordersPerDay = (totalOrdersNumber / daysNumber).toFixed(0);
        //percent for quantity of orders
        const ordersPercent = (((yesterdayOrdersNumber / ordersPerDay) - 1) * 100).toFixed(2);
        //summary profit
        const totalGain = calculatePrice(allOrders);
        //profit per day
        const gainPerDay = totalGain / daysNumber;
        //yesterdays profit
        const yesterdayGain = calculatePrice(yesterdayOrders);
        //profit percent
        const gainPercent = (((yesterdayGain / gainPerDay) - 1) * 100).toFixed(2);
        //profit compare
        const compareGain = (yesterdayGain - gainPerDay).toFixed(2)
        //compare quantity of orders
        const compareNumber = (yesterdayOrdersNumber - ordersPerDay).toFixed(2)

        res.status(200).json({
            gain: {
                percent: Math.abs(+gainPercent),
                compare: Math.abs(+compareGain),
                yesterday:+yesterdayGain,
                isHigher: gainPercent > 0
            },
            orders: {
                percent: Math.abs(+ordersPercent),
                compare: Math.abs(+compareNumber),
                yesterday:+yesterdayOrdersNumber,
                isHigher: +ordersPercent > 0
            }
        })
    }catch(e){
        errorHandler(res, e)
    }
};

module.exports.analytics = async function (req,res) {
    try {
        const allOrders = await Order.find({user: req.user.id}).sort({date: 1})
        const ordersMap = getOrdersMap(allOrders);

        const average = +(calculatePrice(allOrders) / Object.keys(ordersMap).length).toFixed(2)

        const chart = Object.keys(ordersMap).map(label => {
            const gain = calculatePrice(ordersMap[label]);
            const order = ordersMap[label].length;
            return {
                label, order, gain
            }
        });

        res.status(200).json({
            average,
            chart
        })
    }catch (e) {
        errorHandler(res, e)
    }
};

function getOrdersMap(orders = []){
    const daysOrders = {};
    orders.forEach(order => {
        const date = moment(order.date).format('DD.MM.YYYY');

        if(date === moment().format('DD.MM.YYYY')){
            return
        }

        if(!daysOrders[date]){
            daysOrders[date] = []
        }
        daysOrders[date].push(order)
    })
    return daysOrders
}

function calculatePrice(orders = []) {
    return orders.reduce((total, order) => {
        const  orderPrice = order.list.reduce((orderTotal, item) => {
            return orderTotal += item.cost * item.quantity
        }, 0)
        return total += orderPrice
    }, 0)
}