import ai from "../../config/gemini.js";


const natureController = async (req,res)=>{
try {
  const {message} =  req.body;
   if (!message?.trim()) {
      return res.status(400).json({
        msg: "message is required"
      });
    }
const response = await ai.models.generateContent({
 model: "gemini-3.5-flash-lite",
        config: {
    responseMimeType: "application/json"
  },
contents: `
Դու հանգստի և զբոսաշրջության AI օգնական ես, որը մասնագիտացած է բնության գրկում հանգստի տարբերակների մեջ։

Օգտատիրոջ հարցը՝
${message}

Քո խնդիրն է՝
- հասկանալ, թե ինչպիսի հանգիստ է օգտատերը ցանկանում բնության գրկում,
- առաջարկել համապատասխան հանգստի տեսակներ, զբաղմունքներ և գաղափարներ,
- հաշվի առնել օգտատիրոջ նշած վայրը, բյուջեն, մարդկանց քանակը, ժամանակահատվածը և նախասիրությունները,
- չհորինել իրական վայրերի անուններ, հասցեներ, գներ, հեռախոսահամարներ, կայքեր կամ աշխատանքային ժամեր,
- եթե օգտատերը հարցնում է կոնկրետ իրական վայրի մասին, իսկ դու չունես այդ վայրի վերաբերյալ ստուգված տվյալներ, հստակ նշիր, որ չես կարող հաստատել տվյալների արդիականությունը,
- տալ իրատեսական և օգտակար խորհուրդներ։

Պատասխանիր այն նույն լեզվով, որով օգտատերը գրել է։

Պատասխանը վերադարձնել միայն JSON ձևաչափով։
Պատասխանը վերադարձնել միայն հետևյալ JSON կառուցվածքով.

{
  "answer": "Հիմնական պատասխանը",
  "suggestions": [
    "Առաջարկ 1",
    "Առաջարկ 2",
    "Առաջարկ 3"
  ],
  "tips": [
    "Խորհուրդ 1",
    "Խորհուրդ 2"
  ]
}
`
})

const text = response.text;
const result = JSON.parse(text)
return res.status(201).json({
    result
})
} catch (error) {
return res.status(500).json({
    msg:error
})  
}
}

export default natureController