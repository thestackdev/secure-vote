import { ethers } from 'ethers'
// import { logOutWithCometChat } from './Chat.services'
import address from './abis/contractAddress.json'
import abi from './abis/src/contracts/BlockchainVoting.sol/BlockchainVoting.json'
import { getGlobalState, setGlobalState } from './store'

const { ethereum } = window
const contractAddress = address.address
const contractAbi = abi.abi

const getEtheriumContract = () => {
  const connectedAccount = getGlobalState('connectedAccount')

  if (connectedAccount) {
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, contractAbi, signer)

    return contract
  } else {
    return getGlobalState('contract')
  }
}

const isWallectConnected = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    setGlobalState('connectedAccount', accounts[0]?.toLowerCase())

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload()
    })

    window.ethereum.on('accountsChanged', async () => {
      setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
      // await isWallectConnected()
    //   await logOutWithCometChat()
      // await checkAuthState()
      // await getUser()
      window.location.reload()
    })

    if (accounts.length) {
      setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
    } else {
      alert('Please connect wallet.')
      console.log('No accounts found.')
    }
  } catch (error) {
    reportError(error)
  }
}

const connectWallet = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
  } catch (error) {
    reportError(error)
  }
}

const createPoll = async ({ title, image, startsAt, endsAt, description }) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = getEtheriumContract()
    await contract.createPoll(image, title, description, startsAt, endsAt, {
      from: connectedAccount,
    })
    await getPolls()
  } catch (error) {
    reportError(error)
  }
}

const updatePoll = async ({
  id,
  title,
  image,
  startsAt,
  endsAt,
  description,
}) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = getEtheriumContract()
    await contract.updatePoll(id, image, title, description, startsAt, endsAt, {
      from: connectedAccount,
    })
    await getPolls()
  } catch (error) {
    reportError(error)
  }
}

const deletePoll = async (id) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = getEtheriumContract()
    await contract.deletePoll(id, {
      from: connectedAccount,
    })
  } catch (error) {
    reportError(error)
  }
}

const registerUser = async ({ fullname, image }) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = getEtheriumContract()
    await contract.register(image, fullname, { from: connectedAccount })
    await getUser()
  } catch (error) {
    reportError(error)
  }
}

const getUser = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = getEtheriumContract()
    const user = await contract.users(connectedAccount)
    setGlobalState('user', user)
  } catch (error) {
    reportError(error)
  }
}

const getPolls = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const contract = getEtheriumContract()
    const polls = await contract.getPolls()
    setGlobalState('polls', structuredPolls(polls))
  } catch (error) {
    reportError(error)
  }
}

const getPoll = async (id) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const contract = getEtheriumContract()
    const poll = await contract.getPoll(id)
    setGlobalState('poll', structuredPolls([poll])[0])
  } catch (error) {
    reportError(error)
  }
}

const contest = async (id) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = getEtheriumContract()
    await contract.contest(id, { from: connectedAccount })
    await getPoll(id)
  } catch (error) {
    reportError(error)
  }
}

const vote = async (id, cid) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = getEtheriumContract()
    await contract.vote(id, cid, { from: connectedAccount })
    await getPoll(id)
    await listContestants(id)
  } catch (error) {
    reportError(error)
  }
}

const listContestants = async (id) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const contract = getEtheriumContract()
    const contestants = await contract.listContestants(id)
    setGlobalState('contestants', structuredContestants(contestants))
  } catch (error) {
    reportError(error)
  }
}

const structuredPolls = (polls) =>
  polls
    .map((poll) => ({
      id: Number(poll.id),
      title: poll.title,
      votes: Number(poll.votes),
      startsAt: poll.startsAt,
      endsAt: poll.endsAt,
      contestants: Number(poll.contestants),
      director: poll.director?.toLowerCase(),
      image: poll.image,
      deleted: poll.deleted,
      description: poll.description,
      timestamp: new Date(poll.timestamp.toNumber()).getTime(),
    }))
    .reverse()

const structuredContestants = (contestants, connectedAccount) =>
  contestants
    .map((contestant) => ({
      id: Number(contestant.id),
      fullname: contestant.fullname,
      image: contestant.image,
      voter: contestant.voter?.toLowerCase(),
      voters: contestant.voters.map((v) => v?.toLowerCase()),
      votes: Number(contestant.votes),
    }))
    .sort((a, b) => b.votes - a.votes)

const reportError = (error) => {
  console.log(error.message)
  throw new Error('No ethereum object.')
}

export {
  isWallectConnected,
  connectWallet,
  registerUser,
  getUser,
  createPoll,
  updatePoll,
  deletePoll,
  getPolls,
  getPoll,
  contest,
  listContestants,
  vote,
}

