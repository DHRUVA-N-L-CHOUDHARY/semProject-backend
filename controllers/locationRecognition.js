const { OpenAI } = require("openai");
const cloudinary = require('../config/cloudinary');
// Initialize OpenAI API Client
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

exports.recognizeLocation = async (req, res) => {
  try {
    // Check if the image file is uploaded
    if (!req.files || !req.files.image) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded. Please provide a valid image file.",
      });
    }

    const imageFile = req.files.image;

    // Validate file type
    if (!imageFile.mimetype.startsWith("image/")) {
      return res.status(400).json({
        success: false,
        message: "Invalid file type. Please upload an image.",
      });
    }

    console.log("----------------------");

    const uploadResult = await cloudinary.uploader.upload(imageFile.tempFilePath, {
        folder: "landmark_images",
        use_filename: true,
        unique_filename: true,
      });
  
      // Get the Cloudinary URL
      const imageUrl = uploadResult.secure_url;

    // Generate a dynamic prompt for OpenAI
    const prompt = `
        You are a travel expert and historian. Based on the context of the image uploaded, identify the monument or landmark and provide a detailed explanation. 
        The description should include:
        - Name of the landmark (in bold <b></b>)
        - Historical background
        - Cultural significance
        - Interesting facts (highlight important facts in <mark></mark>)

        For example, if the image resembles the Eiffel Tower, explain its history, significance, and facts. 
        Respond in proper HTML structure so the text can be directly displayed on a web page.  Make sure the HTML is clean and properly formatted.`;

    // OpenAI API Call
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o", 
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const description = chatResponse.choices[0].message.content;

    // Send the response
    return res.status(200).json({
      success: true,
      landmarkDetails: description,
    });
  } catch (error) {
    console.error("Error processing the request:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
