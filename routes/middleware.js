function ensureLoggedIn(req, res, next)
{
    console.log("ensureLoggedIn");
    console.log(req.cookies.username);
    if (req.cookies.username)
    {
        next();
    }
    else
    {
        res.redirect('/login');
    }
}

module.exports = {
    ensureLoggedIn
}
