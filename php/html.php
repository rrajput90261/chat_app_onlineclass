
<!-- <html>

<body>
    <form method = "post">
        Enter the Number 
        <input type = "number" name ="number">
        <input type = "submit" value ="submit"> 

    </form>
</body>
</html>
<?php
if($_POST){
    $number = $_POST['number'];
    if($number%2==0){
        echo"$number is an Even Number";
    }
    else{
        echo"$number is an Odd Number";
    }
}
?> -->


<!-- 1. prime number  -->

<html>

<body>
    <form method = "post">
        Enter the Number 
        <input type = "number" name ="number">
        <input type = "submit" value ="submit"> 

    </form>
</body>
</html>
<!-- <?php
if($_POST){
    $number = $_POST['number'];
      $count = 0;
      for($i =1 ; $i<=$number;$i++){
        if($number%$i==0){
            $count++;
        }
      }
      if($count == 2){
        echo "$number is a prime number";
      }
      else{
        echo " $number is not prime";
      }
    
}
?> -->




<!-- 2. leep year or not leep year -->

<?php
if($_POST){
    $number = $_POST['number'];
    if($year%400==0 || $year%100!==)
}
?>