import { Reducer, Store } from '../interfaces/store'
import { Caller } from '../interfaces/app'
import * as Actions from '../interfaces/actions'
import * as Im from 'immutable'

let init: Store.Callers = Im.Map<string, Caller>()

const callers: Reducer<Store.Callers> = (state: Store.Callers = init, action: Actions.CallersAction) => {
  switch (action.type) {
    case Actions.ADD_CALLER:
      return state.set(action.key, action.caller)
    case Actions.REMOVE_CALLER:
      return state.remove(action.key)
    default:
      return state
  }
}

export default callers
