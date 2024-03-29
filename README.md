![](https://img.shields.io/badge/Built%20with%20%E2%9D%A4%EF%B8%8F-at%20Technologiestiftung%20Berlin-blue)

# flusshygiene-berlin-prediction-merge

This script collects the current predictions and merges them with stats from the Lageso. The combined datasets are uploaded to an S3 bucket for easy access.

## States

Two digits (besides 10) with prediction.
Even numbers (besides 10) with algae.

| State-ID | Color                                     | Algae | Prediction | Sign    |
| :------- | :---------------------------------------- | :---- | :--------- | :------ |
| 1        | <span style="color:green;">Green</span>   | 0     | 0          | Check   |
| 11       | <span style="color:green;">Green</span>   | 0     | 1          | Check\* |
| 2        | <span style="color:green;">Green</span>   | 1     | 0          | A       |
| 12       | <span style="color:green;">Green</span>   | 1     | 1          | A\*     |
| 3        | <span style="color:orange;">Orange</span> | 0     | 0          | !       |
| 13       | <span style="color:orange;">Orange</span> | 0     | 1          | !\*     |
| 4        | <span style="color:orange;">Orange</span> | 1     | 0          | A       |
| 14       | <span style="color:orange;">Orange</span> | 1     | 1          | A\*     |
| 5        | <span style="color:red;">Red</span>       | 0     | 0          | X       |
| 15       | <span style="color:red;">Red</span>       | 0     | 1          | X\*     |
| 6        | <span style="color:red;">Red</span>       | 1     | 0          | A       |
| 16       | <span style="color:red;">Red</span>       | 1     | 1          | A\*     |
| 7        |                                           |       |            |         |
| 8        | <span style="color:grey;">Grey</span>     | 1     | 0          | A       |
| 9        | <span style="color:grey;">Grey</span>     | 0     | 0          | k.A.    |
| 10       | <span style="color:orange;">Orange</span> | 0     | 0          | k.A.    |

## Lageso vs. prediction

Even though there are lots of states, the ruling of states is rather simple:

IF _prediction_ is "mangelhaft" AND _lageso_ is better than "mangelhaft" THEN turn color to "orange" and keep the **algae** setting from _lageso_.

This means, if _lageso_ is worse than _prediction_, keep _lageso_. And always keep algae settings. Predictions can only turn a green into an <span style="color:orange;">Orange</span>, <span style="color:red;">red</span> can only be flagged by _lageso_.

## Config.json

For each bathing spot with predictions we have three **IDs**. Those three **IDs** help merge the _Lageso's_ system, the _prediction_ system and the old _website's_ system. At some point the latter could be replace by either the prediction IDs or the lageso IDs.

```json
{
  "predictions":[
    [PREDICTION_ID, LAGESO_ID, OLD_WEB_ID]
  ]
}
```

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://fabianmoronzirfas.me/"><img src="https://avatars.githubusercontent.com/u/315106?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Fabian Morón Zirfas</b></sub></a><br /><a href="https://github.com/technologiestiftung/flusshygiene-berlin-prediction-merge/commits?author=ff6347" title="Code">💻</a> <a href="https://github.com/technologiestiftung/flusshygiene-berlin-prediction-merge/commits?author=ff6347" title="Documentation">📖</a></td>
    <td align="center"><a href="http://www.sebastianmeier.eu/"><img src="https://avatars.githubusercontent.com/u/302789?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Sebastian Meier</b></sub></a><br /><a href="https://github.com/technologiestiftung/flusshygiene-berlin-prediction-merge/commits?author=sebastian-meier" title="Code">💻</a> <a href="https://github.com/technologiestiftung/flusshygiene-berlin-prediction-merge/commits?author=sebastian-meier" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/vogelino"><img src="https://avatars.githubusercontent.com/u/2759340?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Lucas Vogel</b></sub></a><br /><a href="https://github.com/technologiestiftung/flusshygiene-berlin-prediction-merge/commits?author=vogelino" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## Credits

### Partners network

<table>
  <tr>
    <td>
      <a src="https://www.berlin.de/lageso/">
        <img width="150" src="https://logos.citylab-berlin.org/logo-lageso.svg" />
      </a>
    </td>
    <td>
      <a src="https://www.bwb.de/de/index.php">
        <img width="120" src="https://logos.citylab-berlin.org/logo-berliner-wasserbetriebe.svg" />
      </a>
    </td>
    <td>
      <a src="https://www.kompetenz-wasser.de/en">
        <img width="120" src="https://logos.citylab-berlin.org/logo-kwb.svg" />
      </a>
    </td>
    <td>
      <a src="https://www.technologiestiftung-berlin.de/en/">
        <img width="120" src="https://logos.citylab-berlin.org/logo-technologiestiftung-berlin-en.svg" />
      </a>
    </td>
  </tr>
</table>

### Developed in the project

<table>
  <tr>
    <td>
      <a src="https://www.kompetenz-wasser.de/en">
        <img width="150" src="https://logos.citylab-berlin.org/logo-flusshygiene.png" />
      </a>
    </td>
</table>

### Supported by

<table>
  <tr>
    <td>
      <a src="https://www.bmbf.de/bmbf/en/home/home_node.html">
        <img width="120" src="https://logos.citylab-berlin.org/logo-bbf.svg" />
      </a>
    </td>
    <td>
      <a src="https://bmbf.nawam-rewam.de/en/">
        <img width="160" src="https://logos.citylab-berlin.org/logo-nawam.jpg" />
      </a>
    </td>
  </tr>
</table>
