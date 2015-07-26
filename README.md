# Problem:

#### 5/5 votes ranks higher than 199/200 (if you simply compare the ratio).

#### Enter The Wilson Confidence Interval.

Input the number of upvotes & totalvotes and it will return an interval between a low guess and a high guess of what the likely score is. It takes into account statistical significance. 

*WCI is used for decision making and scoring. Think of it as a decent placeholder for your company's not-yet-thought-of super-secret algorithm. It works well for many uses (e.g. Scoring Posts, determining if something is spam, or any other kind of binary categorization).*

Here are some interesting posts which go into more detail.

http://amix.dk/blog/post/19588

http://www.evanmiller.org/how-not-to-sort-by-average-rating.html

This is a paper which talks about using the WCI to determine mTurk worker error rates to figure out when to give workers the boot, which is eerily reminiscent of detecting spam.

http://ilpubs.stanford.edu:8090/1093/1/fp0194-joglekar.pdf

# This Package:

This is a minimal package that only contains the WCI and its own _internal methods to compute Z, on which WCI depends. Avoided bringing in collosal math libraries by only implementing what is required by the WCI. Z is computed by summing terms of the appropriate Maclaurin series; but this is only ever done **one** time on the very first call (makes use of memoization, so it's super fast). Didn't want to bring in some arbitrary table of Z values in case you really need some precise value. The Wilson algorithm itself is inexpensive. That's all that's provided. Using the interval effectively is up to you.

##### This package makes it easy for you to build your own algorithms on top of the WCI - but you don't have to. You could just `Wilson.lazyScore` for a temporary (and actually pretty good) scoring mechanism.

---

## Full API

The global object has a lazy score method if your scoring usage is very simple. You don't need to instantiate `Wilson` objects, just use the global method.

#### `Wilson.lazyScore(positives, total)`

Quickly and accurately returns the lower bound of the WCI for a confidence of .95. This will be a sufficient scoring mechanism for most cases that want something better than score = u/n.

#### `wilsonInstance = new Wilson(confidence)`

Create a new `Wilson`. Cache is shared between instances, since the coefficients don't change.
Unlike the global object, this comes with amore advanced method.

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
  var length = wci[1] - wci[0]
  var isSpam = !! ourSuperSecretAlgorithmThatDoesntExistYet(length, rawRatio)
  return isSpam
})
```

#### `wilsonInstance.reset(newConfidence)`

You can change the confidence level of any instance by calling `.reset(newConfidence)`. This will reset the cached values for some constants used in the WCI, but it will not reset the primary coefficient cache, which is where the bulk of the computation already happened.




