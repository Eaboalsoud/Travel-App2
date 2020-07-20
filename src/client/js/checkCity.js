function checkCity(inputText) {
    console.log("::: Running checkCity :::", inputText);
    let names = [
        "london",
        "New york ",
        "Paris",
        "Rome",
        "Berlin"
    ]

    if(names.includes(inputText)) {
        return true;
    }
}

export { checkCity }
