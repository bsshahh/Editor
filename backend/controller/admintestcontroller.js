import Test from "../model/test.js"; // Adjust path if needed


export const createTest = async (req, res) => {
  try {
    // console.log("hi");
    const { title, description, college, startTime, endTime,duration, totalMarks, questions } =
      req.body;

    const newTest = new Test({
      title,
      description,
      college,
      startTime,
      endTime,
      createdBy: req.user.id, // From verifyAdmin middleware
       duration,
      totalMarks,
      questions,
    });

    const savedTest = await newTest.save();

    res.status(201).json({
      message: "Test created successfully",
      test: savedTest,
    });
  } catch (err) {
    console.error("Error creating test:", err);
    res.status(500).json({ message: "Server error while creating test" });
  }
};


export const getAllTests = async (req, res) => {
  try {
    const tests = await Test.find({ createdBy: req.user.id }).sort({
      createdAt: -1,
    }).lean();

    res.status(200).json(tests);
  } catch (err) {
    console.error("Error fetching tests:", err);
    res.status(500).json({ message: "Server error while fetching tests" });
  }
};

export const deleteTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);
    if (!test) {
      return res.status(404).send({
        message: "test not found",
      });
    }
    return res.status(200).json({
      message: "Test deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting test:", err);
    res.status(500).json({ message: "Server error while deleting tests" });
  }
};

export const updateTest = async (req, res) => {
  try {

    const { title, description, college, startTime, endTime } = req.body;

    let updateData = {
      title,
      description,
      college,
      startTime,
      endTime,
    };

    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const durationInMinutes = Math.floor((end - start) / 60000);
      updateData.duration = durationInMinutes;
    }


    const test = await Test.findByIdAndUpdate(req.params.testId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!test) {
      return res.status(404).send({
        message: "test not found",
      });
    }
    return res.status(200).json({
      message: "Test updated successfully",
    });
  } catch (err) {
    console.error("Error deleting test:", err);
    res.status(500).json({ message: "Server error while deleting tests" });
  }
};
