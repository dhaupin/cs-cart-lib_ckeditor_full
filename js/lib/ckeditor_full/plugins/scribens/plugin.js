// Init Finished
var InitFinished = false;

// Body
var Body = null;

// Previous Text
var TextPrec = '';

// Scribens Window
var WindowSc = null;

// Set if the text has changed
var TextChanged = false;

// Focus lock
var FocusLock = false;

// Main plugin function
CKEDITOR.plugins.add( 'scribens', {
    icons: 'scribens',
    init: function( editor ) {
		
		editor.ui.addButton( 'Scribens', {
			label: 'Spell Checker and Grammar Checker by Scribens',
			command: 'CheckText',
			toolbar: 'insert'
		});
	
        //Plugin logic goes here.
		editor.addCommand( 'CheckText', {
			exec: function( editor )
			{
				// Use CKEDITOR.scriptLoader.load to load an other .js. Use function on the return on callback. But more simple: Put the functions file after.

				// Get the body of CKEditor document.
				if(Body == null)
				{
					Body = editor.document.$.body;
					// Focus on the window editor
					editor.window.$.addEventListener('focus', function()
					{
						FocusLock = true;
					});
				}
				//ff();
				
				// If the window doesn't exist, create it
				if(WindowSc == null || WindowSc.closed)
				{
					InitFinished = false;
					
					// Creer la nouvelle fenetre.
					CreateNewWindow('en');
				}
				// Else do a Check text
				else
				{
					FocusLock = true;
					
					WindowSc.focus();
					
					WindowSc.postMessage('CHECK_TEXT:' + GetText(Body), "*");
				}
			}
		});
		
    }
});

function ff()
{
	if(WindowSc == null) alert('e');
}

// Reception de messages
function OnMessage(event)
{
	var message = event.data;
	
	var indSl = message.indexOf("_");
	var idClient = -1;
	if(indSl > 0)
	{
		idClient = parseInt(message.substr(0, indSl));
		message = message.substr(indSl + 1, message.length - (indSl + 1));
	}

	// Init finished. Fait un GetText	
	if(message == "INIT_FINISHED")
	{
		InitFinished = true;
	
		// Rempli la map des textes (pour la comparaison)
		TextPrec = Body.textContent;
		
		WindowSc.postMessage('CHECK_TEXT:' + GetText(Body), "*");
	}				
	// Evenement focus -> Check text
	else if(message == "FOCUS" && InitFinished == true)
	{
		// Texte actuel.
		var totalText = Body.textContent;

		// Si le texte est different, lance une requete GetText.
		if((totalText != TextPrec) ||
		   (TextChanged == true))	// Ou si le texte a ete modifie (remplacement, ajout de caractere, etc.)
		{
			if(FocusLock == true)
			{
				TextChanged = false;
				
				WindowSc.postMessage('CHECK_TEXT:' + GetText(Body), "*");
			}
		}
		
		TextPrec = totalText;
		
		FocusLock = false;
	}
	// Remplacement ou suppression. Fait un GetText
	else if(message.indexOf("REP:") == 0 ||	// Remplacement
			message.indexOf("REM:") == 0)	// Suppression
	{
		var fields = message.substr(4, (message.length - 4));
		var tabSt = fields.split(";");
		var supp = (message.indexOf("REM:") == 0);
		
		var sucess = ReplaceWord(parseInt(tabSt[0]), parseInt(tabSt[1]), parseInt(tabSt[2]), parseInt(tabSt[3]), tabSt[4], tabSt[5], supp, Body, false);
		
		if(sucess == true)
		{
			TextChanged = true;
		}
		// Si le remplacement a connu un probleme, il faut absolument refaire un CHECK_TEXT afin de synchroniser les 2 textes.
		// On envoie PB_REMPLACEMENT puis GetText, car on ne peux pas faire 2 postMessage a la fois.
		else
		{
			WindowSc.postMessage('CHECK_TEXT:' + GetText(Body), "*");
			
			WindowSc.postMessage('PB_REMPLACEMENT', "*");
		}
		
		// Met a jour la map du textPrec.
		TextPrec = Body.textContent;
	}
}

// Creer une nouvelle fenetre de correction
function CreateNewWindow(langId)
{
	var w = 1200;
	var h = 600;
	var left = (screen.width/2)-(w/2);
	var top = (screen.height/2)-(h/2);
	
	// Choice of lang
	var url = '';
	if(langId == 'fr') url = 'https://www.scribens.fr';
	else if(langId == 'en') url = 'https://www.scribens.com';
	
	WindowSc = window.open(url + '/plugin.html?plugin=Wysiwyg&&version=2&&idclient=1', '1', 'width=' + w + ',height=' + h + ',left=' + left + ',top=' + top + ',titlebar=no');

	// Initialise les evenements. L'objet window correspond a la fenetre de l'onglet. 
	window.addEventListener ("message", OnMessage, false);
}

//////////////////////////
// Functions of Util.js //
//////////////////////////

// Retourne l'ensemble du texte sous forme d'une liste de paragraphes.
function GetText(nodeBody)
{
	Text = '';
	CntP = 0;
	GetP(nodeBody, -1, -1, -1, null);
	return Text;
}

// Remplace ou supprime un ensemble de caracteres definis par un range
// char 160 : faire la comparaison avec que des espaces 160.
function ReplaceWord(indP1, pos1, indP2, pos2, nvText, textToReplace, supp, nodeBody, char160)
{
	if(nvText) nvText = nvText.replace("___pv___", ";");    // Le separateur etant ;, on le remplace par ___pv___
	if(textToReplace) textToReplace = textToReplace.replace("___pv___", ";");    // Le separateur etant ;, on le remplace par ___pv___
	
	var add = (indP1 == indP2 && pos1 == pos2);
	
	// Creer le range correspondant a la modification
	document = nodeBody.ownerDocument;
	Range = document.createRange();

	// Trouve les bornes du range (remplacement) ou ajoute des caracteres
	CntChar = 0;
	LockRangeStart = false;
	LockRangeEnd = false;
	LockAdd = false;
	LockFirstTextNode = false;
	CntP = 0;
	var textAdd = null;
	if(add) textAdd = nvText;
	
	GetP(nodeBody, nodeBody, indP1, pos1, (pos2 - pos1), textAdd)

	// Remplacement du range.
	if(add == false)
	{
		// Fait la verification du texte
		var rangeSt = Range.toString();
		//alert(rangeSt);
		
		// Remplacement
		if(supp == false)
		{
			// Fait la comparaison avec les caracteres 160.
			if(char160)
			{	
				rangeSt = rangeSt.replace(new RegExp(String.fromCharCode(32), 'g'), String.fromCharCode(160));
				textToReplace = textToReplace.replace(new RegExp(String.fromCharCode(32), 'g'), String.fromCharCode(160));
			}
		
			if(rangeSt == textToReplace || (textToReplace == "_"))
			{
				// Si le textNode correspond au rangeSt (le textNode est balise, mise en forme),
				// alors on remplace le textNode pour eviter la disparition de la mise en forme.
				var textNode = Range.endContainer;
				if(textNode && (textNode.nodeValue == rangeSt))
				{
					textNode.nodeValue = nvText;
				}
				else
				{
					//alert(rangeSt);
					// Supprime le contenu du range
					Range.deleteContents();
					// Cree un texte node et l'insere juste avant le range
					textNode = document.createTextNode (nvText);
					Range.insertNode(textNode);
				}
			}
			// Le remplacement ne corresponds pas au texte a remplacer.
			else return false;
		}
		// Suppression
		else
		{
			// Supprime le contenu du range
			Range.deleteContents();
			
			// Cas particulier (DIV et P) : Si le nodeP ne contient plus rien, il faut lui rajouter un <Br> dans la balise div.
			//if(textAreaStructure == 'DIV' || textAreaStructure == 'P')
			/*{
				if(EstDivVide(nodeStart))
				{
					var nodeBr = document.createElement("br");
					nodeStart.appendChild(nodeBr);
					//alert(nodeBody.outerHTML);
				}
				
			}*/
		}
	}
	
	return true;
}

// Parcours de l'arbre de gauche a droite pour trouver les P.
// node : node du body
// indP : indice du P ou s'effectue la modification
// offset : position dans P du mot a remplacer
// wordLength : longueur dun mot a remplacer
// textAdd : texte a ajouter dans le cas d'un ajout
function GetP(node, nodeBody, indP, offset, wordLength, textAdd)
{
	// Cas particulier : Une DIV ou P ou UL n'a pas de texte. Elle doit obligatoirement etre rempli avec une balise, qui est BR.
	if(EstDivVide(node))
	{
		var vectNode = [];
		vectNode.push(node);
		
		Text = Text + '[[[p]]]';
			
		// Cas d'un remplacement ou d'un ajout. On a l'ensemble des node d'un P.
		if((indP > -1) && (indP == CntP))
		{	
			Rep(vectNode, offset, wordLength, textAdd, true);
		}
			
		CntP = CntP + 1;
	}
	else
	{
		for (var i = 0; i < node.childNodes.length; i++)
		{
			var childNode = node.childNodes[i];
			var name = childNode.nodeName;
			
			// Cas particulier : eviter balise Style dans brouiilons de Hotmail)
			if(name == 'STYLE') continue;
			//alert(name);
			// Parcours jusqu'a ce qu'il y ai une balise DIV, P ou UL.
			var lock;
			var textP = '';
			var vectNode = [];	// Ensemble des Node qui constitue le paragraphes.
			
			// Cas particulier (ex : live) : 1er paragraphe : des textNode. 2eme paragraphe : DIV. Si on supprime le 1er paragraphe, il ne reste plus qu'un textnode de longueur 0. Le child suivant est un DIV.
			if(AjoutP0(childNode, nodeBody, indP, offset, textAdd)) break;
			
			while((name != 'DIV') && (name != 'P') && (name != 'UL') && (name != 'LI') && (name != 'BR'))
			{
				textP = textP + childNode.textContent;
				
				if(indP > -1) vectNode.push(childNode);
				
				// Cas particulier : si le textnode est un saut de ligne (cas particulier des brouiilons de Hotmail).
				if(TextNodeSautDeLigne(childNode)) textP = '';
				// Commentaires
				//alert(textP);
				//if(textP.indexOf('<!--') == 0) textP = '';
				
				//alert(textP);
				if(i < (node.childNodes.length - 1))
				{
					childNode = node.childNodes[i + 1];
					name = childNode.nodeName;
					i++;
				}
				else
				{
					childNode = null;
					break;
				}
			}
			
			if(textP.length > 0)
			{
				Text = Text + '[[[p]]]' + textP;
				
				// Cas d'un remplacement ou d'un ajout. On a l'ensemble des node d'un P.
				if((indP > -1) && (indP == CntP))
				{	
					Rep(vectNode, offset, wordLength, textAdd, false);
					
					CntP = CntP + 1;
					break;
				}
				
				CntP = CntP + 1;
			}
			
			if(childNode != null)
			{
				//alert(childNode.outerHTML);
				GetP(childNode, nodeBody, indP, offset, wordLength, textAdd);
			}
		}
	}
}

// Determine si le DIV est vide, c'est a dire avec un texte de longueur 0. Il contient souvent un BR a la fin.
// La div vide peux contenir plusieurs textNode de longueur 0 (Etonnant !). Notamment apres avoir supprime puis rajouter des caracteres.
function EstDivVide(node)
{
	if(node)
	{
		if(node.textContent.length == 0)
		{
			//alert(node.nodeName);
			if((node.nodeName == 'DIV') || (node.nodeName == 'P') || (node.nodeName == 'UL') || (node.nodeName == 'LI'))
			{
				/*var containBr = false;
				//alert('compo');
				for(var i = 0; i < node.childNodes.length; i++)
				{
					var childNode = node.childNodes[i];
					//alert(childNode.nodeName);
					if(childNode.nodeName == 'BR')
					{
						containBr = true;
						break;
					}
				}
				
				if(containBr == false)
				{*/
					return true;
				//}
			}
		}
		
		// Cas <BR>n*TextNodeVide<BR>
		if(node.nodeName == 'BR')
		{
			var nextNode = node.nextSibling;
			var divVide = false;
			
			while(nextNode != null)
			{
				/*if(nextNode.textContent.length > 0)
				{
					return false;
				}*/
				
				if(nextNode.nodeName == 'BR')
				{
					return true;
				}
				
				if(nextNode.nodeName == '#text' && nextNode.textContent.length == 0)
				{
					nextNode = nextNode.nextSibling;
				}
				else return false;
			}
		}
	}

	return false;
}

// Determine si le textnode est un saut de ligne (cas particulier des brouiilons de Hotmail).
function TextNodeSautDeLigne(node)
{
	var cntSautLigne = 0;
	for(var v = 0; v < node.textContent.length; v++)
	{
		if(node.textContent.charCodeAt(v) == 10) cntSautLigne = cntSautLigne + 1;
	}
	
	if(cntSautLigne > 0 && (cntSautLigne == node.textContent.length)) return true;
	else return false;
}

// Fonction de remplacement ou d'ajout.
// Parcours l'arbre pour trouver les textNode.
// nodeBody : node du body
// offset : position dans P du mot a remplacer
// wordLength : longueur dun mot a remplacer
// textAdd : texte a ajouter dans le cas d'un ajout
// DIVVide : si le P a un texte vide
function Rep(vectNode, offset, wordLength, textAdd, DIVVide)
{
	if(DIVVide == false)
	{
		for (var i = 0; i < vectNode.length; i++)
		{
			var node = vectNode[i];
			
			if(node.nodeName == '#text') CntInTextNode(node, offset, wordLength, textAdd);
			else
			{
				for (var u = 0; u < node.childNodes.length; u++)
				{
					var childNode = node.childNodes[u];
				
					// TextNode
					if(childNode.nodeName == '#text') CntInTextNode(childNode, offset, wordLength, textAdd);
					else
					{
						var newVectNode = [];
						newVectNode.push(childNode);
						Rep(newVectNode, offset, wordLength, textAdd, DIVVide);
					}
				}
			}
		}
	}
	// Cas particulier d'un DIV vide. <DIV><BR></DIV>. Ajout.
	else
	{
		if(textAdd)
		{
			var textNode = document.createTextNode(textAdd);
			var node = vectNode[0];
			if(node.nodeName != 'BR')
			{
				node.insertBefore(textNode, node.childNodes[0]);	// Le met avant le BR.
			}
			else
			{
				node.parentNode.insertBefore(textNode, node.nextSibling);	// Le met apres le BR qui suit le node.
			}
		}
	}
}

// Traitement dans le texte node
function CntInTextNode(node, offset, wordLength, textAdd)
{
	var nbChar = node.textContent.length;
	var nbCharPrec = CntChar;
	CntChar = CntChar + nbChar;		// CntChar : compteur de charactere depuis le debut du P.
	
	if(CntChar >= offset)
	{
		if(textAdd == null)
		{
			// Start
			if(LockRangeStart == false)
			{
				LockRangeStart = true;
				//alert(offset - (CntChar - nbChar));
				Range.setStart(node, offset - (CntChar - nbChar));
			}
			
			// End
			if(CntChar >= (offset + wordLength))
			{
				if(LockRangeEnd == false)
				{
					LockRangeEnd = true;
					//alert((offset + wordLength) - nbCharPrec);
					Range.setEnd(node, (offset + wordLength) - nbCharPrec);
				}
			}
		}
		// Ajout de caracteres
		else
		{
			// Remplace la valeur. Modifie le textNode : tres fiable.
			if(LockAdd == false)
			{
				LockAdd = true;
				var st = node.nodeValue;
				node.nodeValue = st.substring(0, offset - (CntChar - nbChar)) + textAdd + st.substring(offset - (CntChar - nbChar), st.length);
			}
		}

	}
}

// Cas particulier (ex : Live) : 1er paragraphe : des textNode. 2eme paragraphe : DIV. Si on supprime le 1er paragraphe, il ne reste plus qu'un textnode de longueur 0. Le child suivant est un DIV.
function AjoutP0(node, nodeBody, indP, offset, textAdd)
{
	if(indP == 0 && offset == 0)
	{
		if(node.nodeName == '#text' && node.textContent.length == 0)
		{
			if(LockFirstTextNode == false)
			{
				LockFirstTextNode = true;
				//if(node.textContent.length == 0)
				//{
					// 1er cas : textNode vide avec une DIV ensuite.
					// 2nd cas : textNode vide avec nodeBody de longueur text 0.
					var parentNode = node.parentNode;
					if((node == parentNode.childNodes[0] && parentNode.childNodes.length > 1 && (parentNode.childNodes[1].nodeName == 'DIV' || parentNode.childNodes[1].nodeName == 'BR')) ||
					   (nodeBody.textContent.length == 0))
					{
						node.nodeValue = textAdd;
						return true;
					}
				//}
			}
		}
	}
	
	return false;
}

