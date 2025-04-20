import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { Loader2 } from 'lucide-react';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function WalletConnect() {
  const [account, setAccount] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState<string | null>(null);
  const { toast } = useToast();

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            const network = await provider.getNetwork();
            setAccount(accounts[0].address);
            setNetwork(network.name);
            setChainId(network.chainId.toString());
          }
        } catch (error) {
          console.error("Failed to check wallet connection:", error);
        }
      }
    };
    
    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setAccount(null);
          setNetwork(null);
          setChainId(null);
          toast({
            title: "Wallet Disconnected",
            description: "Your wallet has been disconnected",
          });
        } else {
          setAccount(accounts[0]);
        }
      };

      const handleChainChanged = (_chainId: string) => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [toast]);

  async function connectWallet() {
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      // Check if the browser is Chrome
      const isChrome = /chrome/i.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      
      toast({
        title: "Wallet not found",
        description: isChrome 
          ? "Please unlock your MetaMask and refresh the page" 
          : "Please install MetaMask or another Web3 wallet",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      
      setAccount(accounts[0]);
      setNetwork(network.name);
      setChainId(network.chainId.toString());
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${network.name}`,
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  }

  async function switchToArbitrum() {
    if (!window.ethereum) return;
    
    try {
      // Try to switch to Arbitrum network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xa4b1' }], // Arbitrum One chainId
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xa4b1',
                chainName: 'Arbitrum One',
                nativeCurrency: {
                  name: 'Ether',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://arb1.arbitrum.io/rpc'],
                blockExplorerUrls: ['https://arbiscan.io/'],
              },
            ],
          });
        } catch (addError) {
          console.error(addError);
        }
      }
      console.error(switchError);
    }
  }

  function shortenAddress(address: string | null) {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  return (
    <motion.div
      {...fadeIn}
      className="w-full"
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 18V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.89 6 10 6.9 10 8V16C10 17.1 10.89 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z" fill="currentColor"/>
            </svg>
            Web3 Wallet
          </CardTitle>
          <CardDescription>
            Connect your wallet to access DeFi features
          </CardDescription>
        </CardHeader>
        <CardContent>
          {account ? (
            <div className="space-y-2">
              <div className="rounded-lg bg-secondary p-3">
                <p className="text-sm font-medium">Connected Account</p>
                <p className="text-xs text-muted-foreground truncate">{account}</p>
                <p className="text-xs font-medium mt-2">Short Address</p>
                <p className="text-xs text-muted-foreground">{shortenAddress(account)}</p>
              </div>
              <div className="rounded-lg bg-secondary p-3">
                <p className="text-sm font-medium">Network</p>
                <p className="text-xs text-muted-foreground">{network} (Chain ID: {chainId})</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">
                Connect your wallet to access token-based staking, marketplace transactions, and governance.
              </p>
              <Button 
                onClick={connectWallet} 
                disabled={isConnecting}
                className="w-full"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : "Connect Wallet"}
              </Button>
            </div>
          )}
        </CardContent>
        {account && (
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={switchToArbitrum}
            >
              Switch to Arbitrum
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}