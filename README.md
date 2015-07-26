# Wilson Confidence Interval, for Meteor.

*WCI is used for decision making and scoring. It works well for many uses (e.g. Scoring Posts, determining if something is spam, or any other kind of binary categorization).*

Reddit scoring: http://amix.dk/blog/post/19588

Scoring properly: http://www.evanmiller.org/how-not-to-sort-by-average-rating.html

Research about determining mTurk worker quality: http://ilpubs.stanford.edu:8090/1093/1/fp0194-joglekar.pdf

### Problem:

**5/5 votes ranks higher than 199/200 (if you simply compare the ratio).**

One vote is meaningless from a statistical standpoint (if your system allows votes from many).

### Solution:

**The Wilson Confidence Interval.**

Input the number of upvotes & totalvotes and it will return an interval between a low guess and a high guess of what the likely score is, taking into account the amount of votes.



# This Package:

A minimal package that computes (with memoization) what is needed for the WCI from scratch (no collosal mathematics libraries needed). The Wilson algorithm itself is inexpensive. That's all that's provided. Using the interval effectively is up to you.

**This package makes it easy for you to build your own algorithms on top of the WCI - but you don't have to. You could just `Wilson.lazyScore` for a temporary (and actually pretty good) scoring mechanism.**

---

## Full API

#### `Wilson.lazyScore(positives, total)`

Quickly and accurately returns the lower bound of the WCI for a confidence of .95. This will be a sufficient scoring mechanism for most cases that want something better than score = u/n. No need to create `new Wilson(confidence)` objects.

#### `wilsonInstance = new Wilson(confidence)`

Create a new `Wilson`. Cache shared between instances, since the particular Maclaurin coefficients are independent of the confidence. This comes with a more advanced method.

#### `wilsonInstance.score(positives, total, optionalCallback(WCI, rawRatio))`

You can think of the raw ratio, upVotes/totalVotes, as a score between (0,1) But this isn't acceptable, as seen above. Without a callback, `.score(positives, total)` returns an interval of numbers, both between (0,1) which you can use to get a better effective score/rank.
```
var myPost = getFromMongo('postId');
var postRanker = new Wilson(.9);
var rank = postRanker.score(myPost.up, myPost.total); // returns [lowerBound, upperBound] (numbers in (0,1));
myPost.mongoUpdateScore(rank[0]) // choose the pessimistic value, for example.
```
The callback is passed this interval (the WCI) and the raw ratio so you can do your own math on it, and return a more advanced and representative score.
```
var spamDetector = new Wilson(.95);
var postIsSpam = spamDetector.score(myPost.markedSpamNumber, myPost.totalViews, function(wci, rawRatio){
  var WCILength = wci[1] - wci[0]
  var acceptableSpamRatio = .2
  var isSpam = false;
  if (WCILength < .05){
  	isSpam = rawRatio > acceptableSpamRatio
  }
  return isSpam;
})
myPost.markSpam(postIsSpam) // update the DB
```

#### `wilsonInstance.reset(newConfidence)`

Change the confidence level of any instance by calling `.reset(newConfidence)`. This will reset only one cached value, but it will not reset the entire Maclaurin coefficient cache (as it is independent of confidence).




