import Test from "../model/test.js";
import UserTest from "../model/userTest.js";

export const getAvailableTests = async (req, res) => {
  try {
    const userCollege = req.user.organization;
    const now = new Date();
    // console.log(userCollege);
    const tests = await Test.find({
      $or:[
        {college: userCollege},
        {college: "ALL"},
      ],
    //   startTime: { $lte: now },
    //  endTime: { $gt: now },
    }).lean();
    // console.log(tests);
    res.status(200).json(tests);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tests" });
  }
};

export const getTestById=async(req,res)=>{
    try{
        const test= await Test.findById(req.params.id);
        res.status(200).json(test);
    }catch(err){
        res.status(404).json({
            message:"Test not found"
        });
    }
};

export const getUserSubmissions = async (req, res) => {
  try {
    const userId = req.user.id;
    const submissions = await UserTest.find({ userId }).lean();
    // console.log(submissions);
    res.status(200).json(submissions);
  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const submitTestSolution = async (req, res) => {
  try {
    const userId = req.user.id;
    const testId = req.params.testId;

    const existing = await UserTest.findOne({ userId, testId });
    if (existing && existing.submitted === true) {
      // console.log(existing.submitted);
      return res.status(400).json({ message: "Test already submitted" });
    }

    await UserTest.findOneAndUpdate(
      { userId, testId },
      { submitted: true, submittedAt: new Date() },
      { upsert: true }
    );

    res.status(200).json({ message: "Test submitted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const saveUserResponse = async (req, res) => {
  try {

    const {testId,questionId,code,language,passedCount,totalCases,marksEarned}=req.body;
    
    const userId = req.user.id;
    // const testId = req.params.testId;

    let userTest = await UserTest.findOne({ userId, testId });
    if (userTest?.submitted === true) {
      console.log("hi");
      return res.status(400).json({ message: "Test already submitted. Cannot save response." });
    }
    console.log("hi2");
    const responseData = {
      questionId,
      language,
      code,
      passedCount,
      totalCases,
      marksEarned,
      submittedAt: new Date()
    };

    if (!userTest) {
      // New entry for the first question response
      userTest = new UserTest({
        userId,
        testId,
        submitted: false,
        responses: [responseData],
        score: marksEarned
      });
    } else {
      // Check if this question was already answered
      const existingIndex = userTest.responses.findIndex(
        (resp) => resp.questionId.toString() === questionId
      );

      if (existingIndex !== -1) {
        userTest.responses[existingIndex] = responseData;
      } else {
        userTest.responses.push(responseData);
      }

      // Recalculate score
      userTest.score = userTest.responses.reduce((sum, r) => sum + r.marksEarned, 0);
    }

    await userTest.save();

    res.status(200).json({ message: "Response saved",score: UserTest.score });
  } catch (err) {
    console.error("Error saving user response:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
