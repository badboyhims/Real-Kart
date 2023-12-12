#include<bits/stdc++.h>
using namespace std ;

// malayalam

bool check(string s){
    int n = s.size() ;
    int i1 = 0 , i2 = n-1 ;
    while(i1 < i2){
        if(s[i1] != s[i2]){
            return false ;
        }
        i1++ ;
        i2-- ;
    }
    return true ;
}
