export function AboutProject() {
  return (
    <div className="bg-gray-900 h-[calc(100vh-200px)] flex items-center justify-center py-16 px-6">
      <div className="max-w-4xl mx-auto h-full flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-white mb-8">About YeetHub</h2>
        <div className="space-y-6 text-gray-300 leading-relaxed">
          <p>
            YeetHub is a decentralized platform that allows you to deploy and use Hugging Face Spaces 
            as standalone Docker applications. Simply provide a Hugging Face Space link, and we'll 
            handle the deployment for you.
          </p>
          <p>
            <strong className="text-white">How it works:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Connect your Solana wallet to store your deployment history</li>
            <li>Create a new Yeet app by providing your Hugging Face Space URL</li>
            <li>We deploy the Docker container and provide you with a live instance</li>
            <li>Access your deployed apps anytime by connecting your wallet</li>
            <li>Pay for usage seamlessly with x402 tokens</li>
          </ul>
          <p>
            Your wallet address is your identity - all your deployments and usage history are tied 
            to your wallet, so you can easily access them whenever you return.
          </p>
        </div>
      </div>
    </div>
  );
}
