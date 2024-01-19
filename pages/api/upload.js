// import multiparty from 'multiparty'

// export default async function handle(req, res) {
//     const form = new multiparty.Form();

//     const { fields, files } = await new Promise((resolve, reject) => {
//         form.parse(req, (err, fields, files) => {
//             if (err) reject(err);
//             resolve({ fields, files });
//         });
//     })

//     console.log("lenght:", files.file.lenght);
//     console.log(fields);
//     return res.json("Ok")
// }

// export const config = {
//     api: { bodyParser: false },
// }

// import { CldUploadButton, CldImage } from 'next-cloudinary';
// import { useState } from 'react';

// const [imageId, setImageId] = useState('')

// export default function UploadImg(){
//     return (

//         <>
//             <div className="flex p-1">
//                 {imageId &&
//                     (<CldImage className="m-2 rounded-lg"
//                         width="200"
//                         height="200"
//                         src={imageId}
//                         sizes="100vw"
//                         alt="Description of my image"
//                     />)}
//                 <CldUploadButton className="w-44 h-32 mt-3 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-100"

//                     onUpload={(result) => {
//                         setImageId(result.info.public_id);
//                     }}
//                     uploadPreset="rb28datv" />

//             </div>

//             {!imageId && (
//                 <div>No Photos in the Product</div>
//             )}


//         </>
//     )
// }