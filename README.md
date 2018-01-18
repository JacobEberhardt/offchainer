This is the repository for the project "Off-chaining Smart Contract Data to RDBMS"

Created as project in the course **Cloud Prototyping** at TU Berlin

### Team
This project is implemented and consists of the following team members:

| Name | github | mail
|------|--------|----
|Dukagjin Ramosaj|dukagjinramosaj1|<dukagjin.ramosaj@campus.tu-berlin.de>
|Thanh Tuan Tenh Cong|kaziller|<tenhcong@campus.tu-berlin.de>
|Kevin Marcel Styp-Rekowski|kevinstyp|<kevin.styp@hotmail.de>
|Tarek Higazi|Tarek-higazi|<Tarek.higazi@campus.tu-berlin.de>
|Vincent Jonany|vincentvjj|<v.jonany@campus.tu-berlin.de>
|Simon Fallnich|simonfall|<fallnich@campus.tu-berlin.de>
|Patrick Friedrich|patnorris|<patrick.friedrich@campus.tu-berlin.de>

### Prerequisite
- NodeJs
- Docker
- Truffle 
- Ganache GUI

### How to run
1. In your local repo root, run "docker build -t localprebuild docker/prebuild"
2. If you're on macOS, uncomment line 18 in the docker-compose.yml file
3. In your local repo root, run "docker-compose build"
4. Install the Ganache GUI: https://github.com/trufflesuite/ganache/releases
5. Run the Ganache GUI app
6. In your local blockchain directory, run "truffle migrate"
7. In your local repo root, run "docker-compose up"
8. Repeat steps 6 and 7 whenever something changes in your smart contracts, no need to rebuild

### Testing
- run the command below to test the bulk of the current implementation to make sure you have not broken anything.
```
node src/middleware/server/test/testMerkleTree.js
```
