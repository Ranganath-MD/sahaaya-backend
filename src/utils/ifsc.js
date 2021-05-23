const ifsc = require("ifsc");

exports.fetchBankDetails = async (code) => {
  if (ifsc.validate(code)) {
    try {
      const response = await ifsc.fetchDetails(code);
      return response
    }catch {
      return new Error();
    }
  }else {
    return { error: "Invalid IFSC Code" }
  }
}