const errorController = {}

errorController.triggerError = async function(req, res) {
    throw new Error("Footer link error");
}

module.exports = errorController