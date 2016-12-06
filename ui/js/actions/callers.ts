import * as Actions from '../interfaces/actions'
import { Caller } from '../interfaces/app'

type Action = Actions.CallersAction

export const addCaller = ({key, caller}: {key: string, caller: Caller}): Action => ({
  type: Actions.ADD_CALLER,
  key,
  caller
})

export const removeCaller = (key: string): Action => ({
  type: Actions.REMOVE_CALLER,
  key
})