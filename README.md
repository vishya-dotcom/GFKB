Steps to get this up and running on the website:

1. Take graphScript.js and put it in the folder with the rest of the JS scripts (if that doesn't exist then just put it wherever it makes sense for you)
2. You're going to want to put the following lines either at the bottom right before the </body> in page.about.html, or in the <head> of whichever file handles the importing of the CSS files (I don't have access to it so I'm not sure which file that is):
  	<script src="https://d3js.org/d3.v5.min.js"></script>
  	<script src="graphScript.js"></script>
    NOTE: For the second one, importing "graphScript.js," the path will change depending on what folder you're putting it in. If you need help with this part let me know.
3. In whatever CSS file handles page.about.html, paste the following lines into it:
  		div.tooltip-donut {
  			position: absolute;
  			text-align: center;
  			padding: .5rem;
  			background: #FFFFFF;
  			color: #313639;
  			border: 1px solid #313639;
  			border-radius: 8px;
  			pointer-events: none;
  			font-size: 1.3rem;
  		}
4. In page.about.html, add the following lines in between the GFKB downloads table and the filtered NT link. You can also just take my modified version of it from my branch (make sure to remove the <head> from there if you do though):
					<h5>GutFeeling Knowledgebase Relative Abundance Profiles</h5>
					<h6 id="graph_level_title"></h6>
					<div id="doughnut_chart"></div>
					<div id="graph_buttons">
						<button id="species">Species Level</button>
						<button id="genus">Genus Level</button>
					</div>

That should be it. if you have any questions or things are still not working let me know!
