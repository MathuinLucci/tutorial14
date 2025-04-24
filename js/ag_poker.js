"use strict";

/*
   New Perspectives on HTML5, CSS3, and JavaScript 6th Edition
   Tutorial 14
   Tutorial Case

   Author: Matt Parisano
   Date:   04/15/2025
   
   Filename: ag_poker.js

*/

window.addEventListener("load", playDrawPoker);

function playDrawPoker() {
   var dealButton = document.getElementById("dealB");
   var drawButton = document.getElementById("drawB");
   var standButton = document.getElementById("standB");
   var resetButton = document.getElementById("resetB");
   var handValueText = document.getElementById("handValue");
   var betSelection = document.getElementById("bet");
   var bankBox = document.getElementById("bank");
   var cardImages = document.querySelectorAll("img.cardImg");
   
   //Set the initial values of the pokerGame object
   pokerGame.currentBank = 500;
   pokerGame.currentBet = 25;

   //create a new deck of cards and shuffle it
   var myDeck = new pokerDeck
   myDeck.shuffle();

   //create a pokerHand object
   var myHand = new pokerHand(5)

   bankBox.value = pokerGame.currentBank;
   betSelection.onchange = function(e) {
      pokerGame.currentBet = parseInt(e.target.options[e.target.selectedIndex].value);
   };

   //restart the game when the reset button is clicked
   resetButton.addEventListener("click", function() {
      pokerGame.currentBank = 500;
      bankBox.value = pokerGame.currentBank;
      enableObj(dealButton);
      enableObj(betSelection);
      disableObj(drawButton);
      disableObj(standButton);
   });

   //Enable the Draw and Stand buttons after the deal
   dealButton.addEventListener("click", function() {
      if (pokerGame.currentBank >= pokerGame.currentBet) {
         handValueText.textContent = "";
         disableObj(dealButton);
         disableObj(betSelection);
         enableObj(drawButton);
         enableObj(standButton);
         bankBox.value = pokerGame.placeBet();

         //Deal cardds into the poker hand after confirming...
         //...there are at least 10 cards in the deck
         if (myDeck.cards.length < 10 ) {
            myDeck = new pokerDeck();
            myDeck.shuffle();
         }
         myDeck.dealTo(myHand);
         //display the card images on the table
         for (var i=0; 1<cardImages.length; i++) {
            cardImages[i].src = myHand.cards[i].cardImage();

            //event handler for each card image
            cardImages[i].index = i;
            cardImages[i].onclick = function(e) {
               if (e.target.discard !== true) {
                  e.target.discard = true;
                  e.target.src = "../img/ag_cardback.png";
               } else {
                  e.target.discard = false;
                  e.target.src = myHand.cards[e.target.index].cardImage();
               }
           };
         }

      } else{
         alert("reduce the size of your bet");
      }
   });

   //enable the deal and bet options when the current hand ends
   drawButton.addEventListener("click", function() {
      enableObj(dealButton);
      enableObj(betSelection);
      disableObj(drawButton);
      disableObj(standButton);
      
      //Replace the cards selected for discarding
      for (var i=0; i<cardImages.length;i++){
         if (cardImages[i].discard){
            myHand.cards[i].replaceFromDeck(myDeck);
            cardImages[i].src = myHand.cards[i].cardImage();
            cardImages[i].discard = false;
         }
         cardImages[i].onclick = null;
      }

      //evaluate the hand drawn by the user
      handValueText.textContent = myHand.handType();
      
      //pay pff the final hand
      bankBox.value = pokerGame.payout(myHand.handOdds());
   });
   
   standButton.addEventListener("click", function(){
      enableObj(dealButton);
      enableObj(betSelection);
      disableObj(drawButton);
      disableObj(standButton);
      
      //Evaluate the hand dealt to the user
      handValueText.textContent = myHand.handType();
      
      //pay pff the final hand
      bankBox.value = pokerGame.payout(myHand.handOdds());
   });
   
   //Disable poker button
   function disableObj(obj) {
      obj.disableObj = true;
      obj.style.opacity = 0.25;
   }
   
   //enable poker button
   function enableObj(obj) {
      obj.disableObj = false;
      obj.style.opacity = 1;
   }
}