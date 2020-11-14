const { error } = require("./src/constants")
const File = require('./src/file')
const { rejects, deepStrictEqual } = require('assert')

;
(async () => {

   
   {
        const filePath = './mocks/emptyFile.csv'
        const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE)
        const result = File.csvToJson(filePath)
        await rejects(result, rejection)
   }


    {
        const filePath = './mocks/fouritem.invalid.csv'
        const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE)
        const result = File.csvToJson(filePath)
        await rejects(result, rejection)
    }

    {
        const filePath = './mocks/threeitems-valid.csv' 
        const result = await File.csvToJson(filePath)
        const expected = [
            {
                "name": "Erick Wendel",
                "id": 123,
                "profession": "Javascript Instructur",
                "birthDay": 1995
            },
            {
                "name": "Joao da Silva",
                "id": 321,
                "profession": "Javascript Specialist",
                "birthDay": 1940
            },
            {
                "name": "Vagner Oliveira",
                "id": 345,
                "profession": "Javscript Senior",
                "birthDay": 1987
            }
        ]

        deepStrictEqual(JSON.stringify(result), JSON.stringify(expected))
    }

})();
