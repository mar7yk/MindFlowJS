export class LogicVariable {}

LogicVariable.prototype.type = 'ask_logic_variable'

export const getVar = () => new LogicVariable()
