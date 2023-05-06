import { setGlobalState, useGlobalState } from "../store/index";

const Hero = () => {
  const [user] = useGlobalState("user");
  const [connectedAccount] = useGlobalState("connectedAccount");

  return (
    <div className="text-center mt-10 p-4">
      <h1 className="text-5xl text-black-600 font-bold max-w-xl mx-auto">
        Empowering Democracy with Blockchain Technology
      </h1>
      <p className="pt-5 text-gray-600 text-xl font-medium max-w-[1000px] mx-auto">
        SecureVote is a revolutionary blockchain-based voting app that ensures
        the integrity, transparency, and security of democratic processes. By
        harnessing the power of blockchain technology, SecureVote provides a
        trustworthy platform for conducting elections and surveys, enabling
        citizens to exercise their right to vote with confidence. With
        end-to-end encryption, immutable records, and decentralized consensus,
        our app guarantees the privacy and accuracy of each vote. Join us in
        shaping the future of democracy, where every voice counts and trust is
        redefined. Experience SecureVote today and embrace a new era of secure
        and fair elections.
      </p>
      <div className="flex justify-center pt-10">
        {user?.fullname ? (
          <div className="space-x-2">
            {
              <button
                type="button"
                className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs
                leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg
                focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800
                active:shadow-lg transition duration-150 ease-in-out border border-blue-600"
                onClick={() => setGlobalState("createPollModal", "scale-100")}
              >
                Create Poll
              </button>
            }
          </div>
        ) : (
          <button
            type="button"
            className="inline-block px-6 py-2 border-2 border-blue-600 text-blue-600 font-medium
            text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none
            focus:ring-0 transition duration-150 ease-in-out"
            onClick={() => setGlobalState("contestModal", "scale-100")}
            disabled={!connectedAccount}
            title={!connectedAccount ? "Please connect wallet first" : null}
          >
            Register
          </button>
        )}
      </div>
    </div>
  );
};

export default Hero;
