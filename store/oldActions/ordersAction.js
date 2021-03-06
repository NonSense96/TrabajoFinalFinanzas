import Order from "../../models/order";

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS ='SET_ORDERS';
export const fetchOrders = () =>
{
    //https://mealsapp-d838a-default-rtdb.firebaseio.com/orders/${userId}.json
    return async (dispatch,getState) =>{ 
        const userId = getState().auth.userId;
        try {
        const response = await fetch(`https://finanzasapp-dff53-default-rtdb.firebaseio.com/orders/${userId}.json`);
        if(!response.ok){
            throw new Error('Something went wrong!');
        }
        const resData = await response.json();
        const loadedOrders = [];
        for(const orderKey in resData){
            loadedOrders.push(
                new Order(
                orderKey,
                resData[orderKey].cartItems,
                resData[orderKey].totalAmount,
                new Date(resData[orderKey].date))
            );
        }
        dispatch({
            type:SET_ORDERS,
            orders:loadedOrders
        })
        } catch (error) {
            throw error;
        }
    }
}
export const addOrder = (cartItems,totalAmount)=>
{
    //https://mealsapp-d838a-default-rtdb.firebaseio.com/orders/${userId}.json?auth=${token}
    return async (dispatch,getState)=>{
        const userId = getState().auth.userId;
        const token = getState().auth.token;
        const date =  new Date();
        const response = await fetch(`https://finanzasapp-dff53-default-rtdb.firebaseio.com/orders/${userId}.json?auth=${token}`,{
         method:'POST',
         headers:{
             'Content-Type':'application/json'
         },
         body:JSON.stringify({
             cartItems,
             totalAmount,
             date: date.toISOString()
         })
        });
        const resData = await response.json();
        if(!response.ok){
            throw new Error('something went wrong')
        }
        dispatch({
            type:ADD_ORDER,orderData:{
                id:resData.name,
                items:cartItems,
                amount:totalAmount,
                date:date}
        })
        
    }
}