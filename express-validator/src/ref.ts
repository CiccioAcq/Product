
type AjaxInput = {
    name: string;
    generateAge: (r: any) => void;
};




const ajax = (a: AjaxInput) => {}

ajax ({
    url: "Francesco",
    success: (result) => {
        console.log("nothing")
    }
})

let f1 = () => {
    console.log('nothing');
}

const a: AjaxInput = {
    name: "Francesco",
    generateAge: f1,
};

//OPPURE

const b: AjaxInput = {
    name: "Francesco",
    generateAge: () => {
        console.log('nothing');
    },
};