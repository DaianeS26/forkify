import  axios from 'axios';


export default class Search{
    //add constructor method
    constructor(query){
        this.query = query;
    }

    async getResults(){
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const key = '29ef3da05a15d7d3f620b55bd5fbdc02';
        try {
            const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
            // console.log(this.result);
        } catch (error){
            alert(error);
        }
    }
}




// https://www.food2fork.com/api/search



// https://www.food2fork.com/api/get 




