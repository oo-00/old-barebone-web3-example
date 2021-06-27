window.addEventListener('load', async () => {
 // Wait for loading completion to avoid race conditions with web3 injection timing.
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    try {
      // Request account access if needed
      await window.ethereum.enable();
      // Acccounts now exposed
      return web3;
    } catch (error) {
      console.error(error);
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    // Use Mist/MetaMask's provider.
    const web3 = window.web3;
    console.log('Injected web3 detected.');
    return web3;
  }
  // Fallback to localhost; use dev console port by default...
  else {
    const provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
    const web3 = new Web3(provider);
    console.log('No web3 instance injected, using Local web3.');
    return web3;
  }
});


// If the browser has injected Web3.JS
if (window.web3) {
  // Then replace the old injected version by the local Web3.JS version 1.0.0-beta.N
  window.web3 = new Web3(window.web3.currentProvider);
}

web3.eth.getCoinbase(function(err, account) {
      if (err === null && document.getElementById('addr') !== null) {
				document.getElementById('addr').value = account; // this insterts the found address into the text field in the site
      }
});


var block = 0;
async function blockheight() {
	 return web3.eth.getBlockNumber();
}

function sleep(ms) {
  	return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateblock() {
	block = await blockheight();
	document.getElementById('blockh').innerHTML = block;
	setTimeout(updateblock, 10000);
}

function isvalidaddr(addr) {
	var isvalid = web3.utils.isAddress(addr);
	if(isvalid == true) {
		return true;
	} else {
		return false;
	}
}


function dothething() {
	var velem = document.getElementById('validadd');
	var relem = document.getElementById('results');
	relem.innerHTML = '';
	var addr = document.getElementById('addr').value;
	if(isvalidaddr(addr)) {
		velem.innerHTML = "Loading <img src='ld.gif' style='width: 20px; height: 20px;' /><br />(It's not actually loading anything, but this is where it would be doing that)";
	} else {
		velem.innerHTML = "Invalid address";
	}
}

var web3acc = null;
function mustconnect() {
  if(web3acc !== null) {
    return true;
  }
  web3.eth.getCoinbase(function(err, account) {
        if (err === null) {
          if(account !== null) {
            web3acc = account;
            var shortacc = account.substr(0,8)+'...'+account.substr(-6)
          }
        }
  });
  setTimeout(mustconnect, 3000);
}
