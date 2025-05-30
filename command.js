const commands = [];

function cmd(info, func) {
    const data = {
        ...info,
        function: func,
        desc: info.desc || '',
        fromMe: info.fromMe || false,
        category: info.category || 'misc',
        filename: info.filename || 'Not Provided',
        dontAddCommandList: info.dontAddCommandList || false,
    };

    commands.push(data);
    return data;
}

module.exports = {
    cmd,
    AddCommand: cmd,
    Function: cmd,
    Module: cmd,
    commands,
};
